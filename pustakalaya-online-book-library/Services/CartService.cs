using Microsoft.EntityFrameworkCore;
using pustakalaya_online_book_library.Data;
using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;
using pustakalaya_online_book_library.Services.Interfaces;

namespace pustakalaya_online_book_library.Services
{
    public class CartService : ICartService
    {
        private ApplicationDBContext _context;

        public CartService(ApplicationDBContext context)
        {
            _context = context;
        }

        public void AddToCart(CartDTO cartDto)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == cartDto.UserId);
            if (user == null)
                throw new Exception("User not found");

            var existingCart = _context.Carts.FirstOrDefault(c => c.UserId == cartDto.UserId);

            if (existingCart == null)
            {
                existingCart = new Cart
                {
                    CartId = Guid.NewGuid(),
                    UserId = cartDto.UserId
                };
                _context.Carts.Add(existingCart);
            }

            foreach (var item in cartDto.Items)
            {
                var existingCartDetail = _context.CartDetails
                    .FirstOrDefault(cd => cd.CartId == existingCart.CartId && cd.BookId == item.BookId);

                if (existingCartDetail != null)
                {
                    existingCartDetail.Quantity += item.Quantity;
                }
                else
                {
                    var cartDetail = new CartDetails
                    {
                        CartDetailId = Guid.NewGuid(),
                        CartId = existingCart.CartId,
                        BookId = item.BookId,
                        Quantity = item.Quantity
                    };
                    _context.CartDetails.Add(cartDetail);
                }
            }

            _context.SaveChanges();
        }



        public CartResponseDTO getCartByUserId(Guid userId)
        {
            var user = _context.Users.FirstOrDefault(user => user.UserId == userId);
            if (user == null) 
            {
                throw new Exception("User Not Found");
            }

            var cart = _context.Carts
                .Include(c => c.CartDetails)
                .ThenInclude(cd => cd.Book)
                .FirstOrDefault(cart => cart.UserId == userId);

            if (cart == null)
                throw new Exception("Cart not found");

            return new CartResponseDTO
            {
                CartId = cart.CartId,
                UserId = cart.UserId,
                Items = cart.CartDetails.Select(cd => new CartItemDTO
                {
                    BookId = cd.BookId,
                    BookTitle = cd.Book.Title,
                    Quantity = cd.Quantity
                }).ToList()
            };
        }

        public void IncreateItemQuantity(CartItemQuantity cartItemQuantity)
        {
            var cartDetail = _context.CartDetails
                    .FirstOrDefault(cd => cd.CartId == cartItemQuantity.CartId && cd.BookId == cartItemQuantity.BookId);

            if (cartDetail == null)
                throw new Exception("Item not found");

            cartDetail.Quantity += 1;
            _context.SaveChanges();
        }

        public void DecreaseItemQuantity(CartItemQuantity cartItemQuantity)
        {
            var cartDetail = _context.CartDetails
                .FirstOrDefault(cd => cd.CartId == cartItemQuantity.CartId && cd.BookId == cartItemQuantity.BookId);

            if (cartDetail == null)
                throw new Exception("Cart item not found");

            if (cartDetail.Quantity > 1)
            {
                cartDetail.Quantity -= 1;
                _context.SaveChanges();
            }
           
        }

        public void deleteItem(CartItemQuantity cartItemQuantity)
        {
            var cartDetail = _context.CartDetails
                .FirstOrDefault(cd => cd.CartId == cartItemQuantity.CartId && cd.BookId == cartItemQuantity.BookId);
            if (cartDetail == null)
                throw new Exception("Cart item not found");
            _context.Remove(cartDetail);
            _context.SaveChanges();
        }
    }
}
