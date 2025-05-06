using Microsoft.EntityFrameworkCore;
using pustakalaya_online_book_library.Data;
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
        public async Task<Review> CreateAsync(Review review)
        {
            if(!await _context.Books.AnyAsync(b => b.Id == review.BookId))
            {
                throw new KeyNotFoundException($"Book with ID {review.BookId} not found.");
            }
            if (!await _context.Users.AnyAsync(u => u.UserId == review.UserId))
                throw new KeyNotFoundException($"User with ID {review.UserId} not found.");
            if (await _context.Reviews.AnyAsync(r => r.BookId == review.BookId && r.UserId == review.UserId))
                throw new InvalidOperationException($"User {review.UserId} has already reviewed Book {review.BookId}.");
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            if (review != null)
            {
                return review;
            }
            else
            {
                throw new InvalidOperationException("Error posting review.");
            }
            
        }

        public async Task DeleteAsync(Guid id)
        {
            var review = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == id);
            if (review == null)
                throw new KeyNotFoundException($"Review with ID {id} not found.");
            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Review>> GetAllAsync() =>
            await _context.Reviews
           .Include(r => r.Book)
           .Include(r => r.User)
           .ToListAsync();


        public async Task<IEnumerable<Review>> GetByBookIdAsync(Guid bookId)
        {
            if (!await _context.Books.AnyAsync(b => b.Id == bookId))
                throw new KeyNotFoundException($"Book with ID {bookId} not found.");
            return await _context.Reviews
                .Include(r => r.Book)
                .Include(r => r.User)
                .Where(r => r.BookId == bookId)
                .ToListAsync();
        }

        public async Task<Review> GetByIdAsync(Guid id)
        {
            var review = await _context.Reviews
                .Include(r => r.Book)
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == id);
            if (review == null)
                throw new KeyNotFoundException($"Review with ID {id} not found.");
            return review;
        }

        public async Task UpdateAsync(Guid id, Review review)
        {
            var existingReview = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == id);
            if(existingReview == null)
            {
                throw new KeyNotFoundException($"Review with ID {id} not found.");
            }
            if (review.BookId != existingReview.BookId || review.UserId != existingReview.UserId)
                if (await _context.Reviews.AnyAsync(r => r.BookId == review.BookId && r.UserId == review.UserId && r.Id != id))
                    throw new InvalidOperationException($"User {review.UserId} has already reviewed Book {review.BookId}.");
            existingReview.Rating = review.Rating;
            existingReview.Comment = review.Comment;
            await _context.SaveChangesAsync();
        }
    }
}
