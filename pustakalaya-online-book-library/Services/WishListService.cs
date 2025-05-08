using pustakalaya_online_book_library.Data;
using pustakalaya_online_book_library.Entities;
using pustakalaya_online_book_library.Services.Interfaces;

namespace pustakalaya_online_book_library.Services
{
    public class WishListService : IWishListService
    {
        private ApplicationDBContext _context;

        public WishListService(ApplicationDBContext context)
        {
            _context = context;
        }

        public string ToggleWishList(Guid userId, Guid bookId)
        {
            var user = _context.Users.FirstOrDefault(u => u.userId == userId);
            if (user == null)
                throw new Exception("User not found");

            var book = _context.Books.FirstOrDefault(b => b.Id == bookId);
            if (book == null)
                throw new Exception("Book not found");

            var existingWish = _context.WishLists
                .FirstOrDefault(wish => wish.UserId == userId && wish.BookId == bookId);

            if (existingWish == null)
            {
                var newWish = new WishLists
                {
                    UserId = userId,
                    BookId = bookId
                };

                _context.WishLists.Add(newWish);
                _context.SaveChanges();
                return "Added to wishlist";
            }
            else
            {
                _context.WishLists.Remove(existingWish);
                _context.SaveChanges();
                return "Removed from wishlist";
            }
        }

    }
}
