using Microsoft.EntityFrameworkCore;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;
using pustakalaya_online_book_library.Data;
using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;
using pustakalaya_online_book_library.Services.Interfaces;
using System.Security.Cryptography;

namespace pustakalaya_online_book_library.Services
{
    public class OrderService : IOrderService
    {
        private ApplicationDBContext _context;
        private IEmailService _emailService;

        public OrderService(ApplicationDBContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        string GenerateClaimCode()
        {
            var bytes = new byte[6];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);
            return BitConverter.ToString(bytes).Replace("-", "");
        }


        public OrderDTO AddOrder(OrderCreateDTO orderCreateDTO)
        {
            decimal totalAmount = 0;
            int totalBookCount = 0;
            decimal orderLevelDiscountPercent = 0;

            var user = _context.Users.FirstOrDefault(u => u.UserId == orderCreateDTO.UserId);
            if (user == null)
                throw new Exception("User not found");

            string claimCode = GenerateClaimCode();

            var newOrder = new Orders
            {
                OrderId = Guid.NewGuid(),
                UserId = orderCreateDTO.UserId,
                OrderDate = DateTime.UtcNow,
                Status = "PENDING",
                ClaimCode = claimCode,
                TotalAmount = 0
            };

            _context.Orders.Add(newOrder);

            var orderedItems = new List<(string Title, int Quantity, decimal UnitPrice, decimal FinalPrice)>();

            foreach (var item in orderCreateDTO.Products)
            {
                var book = _context.Books
                    .Include(b => b.Discount)
                    .FirstOrDefault(b => b.Id == item.BookId);

                if (book == null)
                    throw new Exception($"Book with ID {item.BookId} not found");

                if (book.Stock < item.Quantity)
                    throw new Exception($"Not enough stock for book '{book.Title}'. Available: {book.Stock}, Requested: {item.Quantity}");

                decimal originalPrice = (decimal)book.Price;
                decimal finalPrice = originalPrice;

                if (book.Discount != null)
                {
                    var now = DateTime.UtcNow;
                    bool isDiscountValid = (!book.Discount.StartDate.HasValue || book.Discount.StartDate <= now) &&
                                           (!book.Discount.EndDate.HasValue || book.Discount.EndDate >= now);

                    if (isDiscountValid)
                    {
                        finalPrice -= (finalPrice * (decimal)book.Discount.DiscountPercent / 100);
                    }
                }

                totalAmount += finalPrice * item.Quantity;
                totalBookCount += item.Quantity;

                orderedItems.Add((book.Title, item.Quantity, originalPrice, finalPrice));

                var orderedProduct = new OrderedProducts
                {
                    OrderedProductId = Guid.NewGuid(),
                    OrderId = newOrder.OrderId,
                    BookId = item.BookId,
                    Quantity = item.Quantity
                };

                _context.OrderedProducts.Add(orderedProduct);

                book.Stock -= item.Quantity;
                _context.Books.Update(book);
            }

            if (totalBookCount >= 5)
                orderLevelDiscountPercent += 5;

            if (user.OrderCount > 0 && user.OrderCount % 10 == 0)
                orderLevelDiscountPercent += 10;

            if (orderLevelDiscountPercent > 0)
                totalAmount -= (totalAmount * orderLevelDiscountPercent / 100);

            newOrder.TotalAmount = totalAmount;

            user.OrderCount += 1;
            _context.Users.Update(user);

            var cart = _context.Carts
                .Include(c => c.CartDetails)
                .FirstOrDefault(c => c.UserId == orderCreateDTO.UserId);

            if (cart != null)
            {
                foreach (var item in orderCreateDTO.Products)
                {
                    var cartItem = cart.CartDetails.FirstOrDefault(cd => cd.BookId == item.BookId);
                    if (cartItem != null)
                    {
                        _context.CartDetails.Remove(cartItem);
                    }
                }
            }

            _context.SaveChanges();

            var invoiceItems = orderedItems.Select(item =>
                (item.Title, item.Quantity, item.FinalPrice)).ToList();
            var pdfBytes = _emailService.GenerateInvoicePdf(newOrder, invoiceItems);

            _emailService.SendEmailAsync(
                toEmail: user.UserEmail,
                subject: "Order Confirmation",
                body: $@"
                    <html>
                    <head>
                    <style>
                        .container {{
                            font-family: Arial, sans-serif;
                            max-width: 600px;
                            margin: auto;
                            padding: 20px;
                            background-color: #f4f4f4;
                            border-radius: 8px;
                            border: 1px solid #ddd;
                        }}
                        .header {{
                            background-color: #4CAF50;
                            color: white;
                            padding: 15px;
                            text-align: center;
                            font-size: 24px;
                            border-radius: 8px 8px 0 0;
                        }}
                        .content {{
                            padding: 20px;
                            font-size: 16px;
                            color: #333;
                        }}
                        .highlight {{
                            color: #4CAF50;
                            font-weight: bold;
                        }}
                        .footer {{
                            margin-top: 30px;
                            text-align: center;
                            font-size: 13px;
                            color: #777;
                        }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            🛒 Order Confirmed!
                        </div>
                        <div class='content'>
                            <p>Dear <strong>{user.UserName}</strong>,</p>
                            <p>Thank you for your purchase! Your order has been placed successfully.</p>
                            <p><strong>Order Details:</strong></p>
                            <ul>
                                <li><span class='highlight'>Order ID:</span> {newOrder.OrderId}</li>
                                <li><span class='highlight'>Total Amount:</span> Rs. {newOrder.TotalAmount:F2}</li>
                                <li><span class='highlight'>Claim Code:</span> {newOrder.ClaimCode}</li>
                                <li><span class='highlight'>Date:</span> {DateTime.UtcNow:dd MMM yyyy HH:mm} (UTC)</li>
                                <li><span class='highlight'>Order Discount:</span> {orderLevelDiscountPercent}%</li>
                            </ul>
                            <p>You will receive another email once your order is shipped.</p>
                            <p>If you have any questions, feel free to contact us.</p>
                            <p>Happy Reading! 📚</p>
                        </div>
                        <div class='footer'>
                            &copy; {DateTime.Now.Year} Pustakalaya Online Book Library
                        </div>
                    </div>
                </body>
                </html>",
                attachments: new Dictionary<string, byte[]>
                {
                    { "Pustakalaya_invoice.pdf", pdfBytes }
                }
            );

            return new OrderDTO
            {
                OrderId = newOrder.OrderId,
                OrderDate = newOrder.OrderDate,
                Status = newOrder.Status,
                TotalAmount = newOrder.TotalAmount,
                ClaimCode = newOrder.ClaimCode,
                UserId = newOrder.User.UserId,
                UserName = newOrder.User.UserName,
                UserEmail = newOrder.User.UserEmail,
                OrderedItems = _context.OrderedProducts
                    .Where(op => op.OrderId == newOrder.OrderId)
                    .Include(op => op.Book)
                    .Select(op => new OrderItemDTO
                    {
                        BookTitle = op.Book.Title,
                        Quantity = op.Quantity
             
                    })
                    .ToList()
            };

        }


        public void cancleOrder(Guid orderId)
        {
            var order = _context.Orders.FirstOrDefault(order => order.OrderId == orderId);
            if (order == null)
                throw new Exception("Order Not Found");

            var user = _context.Users.FirstOrDefault(storedUser => storedUser.UserId == order.UserId);
            if (user == null)
                throw new Exception("User Not Found");

            if (order.Status == "DELIVERED")
                throw new BadHttpRequestException("Order has already been delivered.");

            if (order.Status == "CANCLED")
                throw new BadHttpRequestException("You cannot change the cancelled order status.");

            var orderedProducts = _context.OrderedProducts
                .Where(op => op.OrderId == orderId)
                .ToList();

            foreach (var orderedProduct in orderedProducts)
            {
                var book = _context.Books.FirstOrDefault(b => b.Id == orderedProduct.BookId);
                if (book != null)
                {
                    book.Stock += orderedProduct.Quantity;
                    _context.Books.Update(book);
                }
            }

            order.Status = "CANCLED";
            _context.SaveChanges();

            _emailService.SendEmailAsync(
                toEmail: user.UserEmail,
                subject: "Order Cancle",
                body: $@"
                <html>
                <head>
                    <style>
                        .container {{
                            font-family: Arial, sans-serif;
                            max-width: 600px;
                            margin: auto;
                            padding: 20px;
                            background-color: #fff3f3;
                            border: 1px solid #f5c2c2;
                            border-radius: 8px;
                        }}
                        .header {{
                            background-color: #dc3545;
                            color: white;
                            padding: 15px;
                            text-align: center;
                            font-size: 22px;
                            border-radius: 8px 8px 0 0;
                        }}
                        .content {{
                            padding: 20px;
                            color: #333;
                            font-size: 16px;
                        }}
                        .footer {{
                            text-align: center;
                            font-size: 13px;
                            color: #777;
                            margin-top: 20px;
                        }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            ❌ Order Cancelled
                        </div>
                        <div class='content'>
                            <p>Dear <strong>{user.UserName}</strong>,</p>
                            <p>We're sorry to inform you that your order has been <strong>cancelled successfully</strong>.</p>
                            <p>If this was a mistake or you need further assistance, please don't hesitate to contact our support team.</p>
                            <p>We hope to serve you better next time!</p>
                        </div>
                        <div class='footer'>
                            &copy; {DateTime.Now.Year} Pustakalaya Online Book Library
                        </div>
                    </div>
                </body>
                </html>"
            );
        }

        public void changeOrderStatus(Guid orderId) { 
            var order = _context.Orders
                .Include(o => o.OrderedProducts)
                .FirstOrDefault(order => order.OrderId == orderId);
            var user = _context.Users.FirstOrDefault(storedUser => storedUser.UserId == order.UserId);
            if (user == null)
                throw new Exception("User Not Found");
            if (order == null)
                throw new Exception("Order Not Found");
   
            foreach (var item in order.OrderedProducts)
            {
                var book = _context.Books.FirstOrDefault(b => b.Id == item.BookId);
                if (book == null)
                    throw new Exception($"Book with ID {item.BookId} not found");
                if (book.Stock < item.Quantity)
                    throw new Exception($"Insufficient stock for book {book.Title}");
                book.Stock -= item.Quantity;
                book.TotalSold += item.Quantity;
                _context.Books.Update(book);
            }

            if(order.Status == "CANCLED")
            {
                throw new BadHttpRequestException("You cannot change the cancled order Status");
            }
            if (order.Status == "DELIVERED")
            {
                throw new BadHttpRequestException("Order has already been delivered.");
            }

            order.Status = "DELIVERED";
            _context.SaveChanges();

            _emailService.SendEmailAsync(
                toEmail: user.UserEmail,
                subject: "Order Delivered",
                body: $@"
                    <html>
                    <head>
                        <style>
                            .container {{ font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f4f4f4; border-radius: 8px; border: 1px solid #ddd; }}
                            .header {{ background-color: #3B82F6; color: white; padding: 15px; text-align: center; font-size: 24px; border-radius: 8px 8px 0 0; }}
                            .content {{ padding: 20px; font-size: 16px; color: #333; }}
                            .footer {{ margin-top: 30px; text-align: center; font-size: 13px; color: #777; }}
                        </style>
                    </head>
                    <body>
                        <div class='container'>
                            <div class='header'>✅ Order Delivered!</div>
                            <div class='content'>
                                <p>Dear <strong>{user.UserName}</strong>,</p>
                                <p>Your order has been successfully delivered.</p>
                                <p>Thank you for shopping with Pustakalaya!</p>
                            </div>
                            <div class='footer'>© {DateTime.Now.Year} Pustakalaya Online Book Library</div>
                        </div>
                    </body>
                    </html>"
            );
        }

        public List<OrderDTO> getAllOrders()
        {
            return _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderedProducts)
                    .ThenInclude(op => op.Book)
                .Select(o => new OrderDTO
                {
                    OrderId = o.OrderId,
                    OrderDate = o.OrderDate,
                    Status = o.Status,
                    TotalAmount = o.TotalAmount,
                    ClaimCode = o.ClaimCode,
                    UserId = o.User.UserId,
                    UserName = o.User.UserName,
                    UserEmail = o.User.UserEmail,
                    OrderedItems = o.OrderedProducts.Select(op => new OrderItemDTO
                    {
                        BookTitle = op.Book.Title,
                        Quantity = op.Quantity
                    }).ToList()
                })
                .ToList();
        }


        public List<OrderDTO> getOrderByUser(Guid userId)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == userId);
            if (user == null)
                throw new Exception("User Not Found");

            return _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.User)
                .Include(o => o.OrderedProducts)
                    .ThenInclude(op => op.Book)
                .Select(o => new OrderDTO
                {
                    OrderId = o.OrderId,
                    OrderDate = o.OrderDate,
                    Status = o.Status,
                    TotalAmount = o.TotalAmount,
                    ClaimCode = o.ClaimCode,
                    UserId = o.User.UserId,
                    UserName = o.User.UserName,
                    UserEmail = o.User.UserEmail,
                    OrderedItems = o.OrderedProducts.Select(op => new OrderItemDTO
                    {
                        BookTitle = op.Book.Title,
                        Quantity = op.Quantity
                    }).ToList()
                })
                .ToList();
        }

        public List<OrderDTO> getOrderByOrderId(Guid orderId)
        {
            return _context.Orders
                 .Where(o => o.OrderId == orderId)
                 .Include(o => o.User)
                 .Include(o => o.OrderedProducts)
                     .ThenInclude(op => op.Book)
                 .Select(o => new OrderDTO
                 {
                     OrderId = o.OrderId,
                     OrderDate = o.OrderDate,
                     Status = o.Status,
                     TotalAmount = o.TotalAmount,
                     ClaimCode = o.ClaimCode,
                     UserId = o.User.UserId,
                     UserName = o.User.UserName,
                     UserEmail = o.User.UserEmail,
                     OrderedItems = o.OrderedProducts.Select(op => new OrderItemDTO
                     {
                         BookTitle = op.Book.Title,
                         Quantity = op.Quantity
                     }).ToList()
                 })
                 .ToList();
        }
    }
}
