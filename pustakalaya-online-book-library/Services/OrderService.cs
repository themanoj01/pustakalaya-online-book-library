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


        public void AddOrder(OrderCreateDTO orderCreateDTO)
        {
            decimal totalAmount = 0;

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
                PaymentStatus = orderCreateDTO.PaymentStatus,
                TotalAmount = 0 
            };

            _context.Orders.Add(newOrder);

            foreach (var item in orderCreateDTO.Products)
            {
                var book = _context.Books.FirstOrDefault(b => b.Id == item.BookId);
                if (book == null)
                    throw new Exception($"Book with ID {item.BookId} not found");

                totalAmount += item.Quantity * (decimal)book.Price;

                var orderedProduct = new OrderedProducts
                {
                    OrderedProductId = Guid.NewGuid(),
                    OrderId = newOrder.OrderId,
                    BookId = item.BookId,
                    Quantity = item.Quantity
                };

                _context.OrderedProducts.Add(orderedProduct);
            }

            newOrder.TotalAmount = totalAmount;

            _context.SaveChanges();

            var orderedItems = orderCreateDTO.Products.Select(p =>
            {
                var book = _context.Books.FirstOrDefault(b => b.Id == p.BookId);
                return (book.Title, p.Quantity, (decimal)book.Price);
            }).ToList();

            // 2. Generate PDF
            var pdfBytes = GenerateInvoicePdf(newOrder, orderedItems);

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
                                <li><span class='highlight'>Total Amount:</span> RS. {newOrder.TotalAmount}</li>
                                <li><span class='highlight'>Claim Code:</span> {newOrder.ClaimCode}</li>
                                <li><span class='highlight'>Date:</span> {DateTime.UtcNow.ToString("dd MMM yyyy HH:mm")} (UTC)</li>
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
                    { "invoice.pdf", pdfBytes }
                }
            );
        }

        public void cancleOrder(Guid orderId)
        {
            var order = _context.Orders.FirstOrDefault(order => order.OrderId == orderId);
            var user = _context.Users.FirstOrDefault(storedUser => storedUser.UserId == order.UserId);
            if (user == null)
            {
                throw new Exception("User Not Found");
            }

            if (order == null)
            {
                throw new Exception("Order Not Found");
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

        public void changeOrderStatus(Guid orderId)
        {
            var order = _context.Orders.FirstOrDefault(order => order.OrderId == orderId);
            var user = _context.Users.FirstOrDefault(storedUser => storedUser.UserId == order.UserId);
            if (user == null)
            {
                throw new Exception("User Not Found");
            }

            if (order == null)
            {
                throw new Exception("Order Not Found");
            }

            order.Status = "DELIVERED";
            _context.SaveChanges();

            _emailService.SendEmailAsync(
                toEmail: user.UserEmail,
                subject: "Order Status",
                body: $@"
                    <html>
                        <head>
                        <style>
                            .container {{
                                font-family: Arial, sans-serif;
                                max-width: 600px;
                                margin: auto;
                                padding: 20px;
                                background-color: #f1fdf5;
                                border: 1px solid #c6e9d8;
                                border-radius: 8px;
                            }}
                            .header {{
                                background-color: #198754;
                                color: white;
                                padding: 15px;
                                font-size: 22px;
                                text-align: center;
                                border-radius: 8px 8px 0 0;
                            }}
                            .content {{
                                padding: 20px;
                                font-size: 16px;
                                color: #333;
                            }}
                            .footer {{
                                text-align: center;
                                font-size: 13px;
                                color: #777;
                                margin-top: 30px;
                            }}
                        </style>
                    </head>
                    <body>
                        <div class='container'>
                            <div class='header'>
                                ✅ Order Collected Successfully
                            </div>
                            <div class='content'>
                                <p>Dear <strong>{user.UserName}</strong>,</p>
                                <p>This is to confirm that your order has been <strong>processed and collected successfully</strong>.</p>
                                <p>We hope you enjoy your books!</p>
                                <p>Thank you for using <strong>Pustakalaya</strong>. We look forward to serving you again soon.</p>
                            </div>
                            <div class='footer'>
                                &copy; {DateTime.Now.Year} Pustakalaya Online Book Library
                            </div>
                        </div>
                    </body>
                    </html>"
            );
        }

        public List<Orders> getAllOrders()
        {
            return _context.Orders.ToList();
        }

        public List<Orders> getOrderByUser(Guid userId)
        {
            var user = _context.Users.FirstOrDefault(user => user.UserId == userId);
            if(user == null)
            {
                throw new Exception("User Not Found");
            }

            return _context.Orders.Where(o => o.UserId == userId).ToList();
        }

        private byte[] GenerateInvoicePdf(Orders order, List<(string Title, int Quantity, decimal Price)> items)
        {
            using var stream = new MemoryStream();
            var document = new PdfDocument();
            var page = document.AddPage();
            var gfx = XGraphics.FromPdfPage(page);

            var fontRegular = new XFont("Arial", 12, XFontStyle.Regular);
            var fontBold = new XFont("Arial", 14, XFontStyle.Bold);
            var fontHeader = new XFont("Arial", 18, XFontStyle.BoldItalic);
            double y = 40;

            // Header
            gfx.DrawString("PUSTAKALAYA INVOICE", fontHeader, XBrushes.DarkSlateBlue, new XRect(0, y, page.Width, 30), XStringFormats.TopCenter);
            y += 40;

            // Order Info
            gfx.DrawString("Order Summary", fontBold, XBrushes.Black, 40, y); y += 25;
            gfx.DrawString($"Order ID: {order.OrderId}", fontRegular, XBrushes.Black, 40, y); y += 20;
            gfx.DrawString($"Claim Code: {order.ClaimCode}", fontRegular, XBrushes.Black, 40, y); y += 20;
            gfx.DrawString($"Order Date: {order.OrderDate:dd MMM yyyy hh:mm tt}", fontRegular, XBrushes.Black, 40, y); y += 30;

            // Table Header
            gfx.DrawString("Book Title", fontBold, XBrushes.Black, 40, y);
            gfx.DrawString("Quantity", fontBold, XBrushes.Black, 300, y);
            gfx.DrawString("Price", fontBold, XBrushes.Black, 400, y);
            y += 20;

            gfx.DrawLine(XPens.Black, 40, y, page.Width - 40, y); y += 10;

            decimal grandTotal = 0;

            foreach (var item in items)
            {
                gfx.DrawString(item.Title, fontRegular, XBrushes.Black, 40, y);
                gfx.DrawString(item.Quantity.ToString(), fontRegular, XBrushes.Black, 300, y);
                gfx.DrawString($"Rs. {item.Price * item.Quantity:F2}", fontRegular, XBrushes.Black, 400, y);
                y += 20;

                grandTotal += item.Price * item.Quantity;
            }

            y += 10;
            gfx.DrawLine(XPens.Black, 40, y, page.Width - 40, y); y += 20;

            // Total
            gfx.DrawString($"Total Amount: Rs. {grandTotal:F2}", fontBold, XBrushes.DarkGreen, 40, y); y += 30;

            // Footer
            gfx.DrawString("Thank you for shopping with Pustakalaya! 📖", fontRegular, XBrushes.Gray, new XRect(0, y, page.Width, page.Height - y), XStringFormats.TopCenter);

            document.Save(stream, false);
            return stream.ToArray();
        }

    }
}
