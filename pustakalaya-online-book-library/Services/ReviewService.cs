using AutoMapper;
using Microsoft.EntityFrameworkCore;
using pustakalaya_online_book_library.Data;
using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;
using pustakalaya_online_book_library.Services.Interfaces;
using System.Collections;

namespace pustakalaya_online_book_library.Services
{
    public class ReviewService : IReviewService
    {
        private readonly ApplicationDBContext _context;

        public ReviewService(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task CreateReviewAsync(ReviewCreateDto dto)
        {
            var bookExists = await _context.Books.AnyAsync(b => b.Id == dto.BookId);
            if (!bookExists)
                throw new KeyNotFoundException("Book not found.");

            var userExists = await _context.Users.AnyAsync(u => u.UserId == dto.UserId);
            if (!userExists)
                throw new KeyNotFoundException("User not found.");

            var hasPurchased = await _context.OrderedProducts
                .Include(op => op.Orders)
                .AnyAsync(op => op.BookId == dto.BookId && op.Orders.UserId == dto.UserId && op.Orders.Status == "DELIVERED");
            if (!hasPurchased)
                throw new InvalidOperationException("User has not purchased this book.");

            var alreadyReviewed = await _context.Reviews.AnyAsync(r => r.BookId == dto.BookId && r.UserId == dto.UserId);
            if (alreadyReviewed)
                throw new InvalidOperationException("You have already reviewed this book.");

            var review = new Review
            {
                BookId = dto.BookId,
                UserId = dto.UserId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ReviewReadDto>> GetReviewsByBookIdAsync(Guid bookId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.BookId == bookId)
                .Include(r => r.User)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewReadDto
                {
                    UserId = r.UserId,
                    Username = r.User.UserName,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return reviews;
        }
    }

}
