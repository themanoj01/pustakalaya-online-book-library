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
        private readonly IMapper _mapper;
        public ReviewService(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<Review> CreateAsync(ReviewCreateDto reviewDto)
        {
            if(!await _context.Books.AnyAsync(b => b.Id == reviewDto.BookId))
            {
                throw new KeyNotFoundException($"Book with ID {reviewDto.BookId} not found.");
            }
            if (!await _context.Users.AnyAsync(u => u.userId == reviewDto.UserId))
                throw new KeyNotFoundException($"User with ID {reviewDto.UserId} not found.");
            if (await _context.Reviews.AnyAsync(r => r.BookId == reviewDto.BookId && r.UserId == reviewDto.UserId))
                throw new InvalidOperationException($"User {reviewDto.UserId} has already reviewed Book {reviewDto.BookId}.");
            var review = _mapper.Map<Review>(reviewDto);
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
           return review;
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

        public async Task UpdateAsync(Guid id, ReviewUpdateDto reviewDto)
        {
            var existingReview = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == id);
            if(existingReview == null)
            {
                throw new KeyNotFoundException($"Review with ID {id} not found.");
            }
            _mapper.Map(reviewDto, existingReview);
            await _context.SaveChangesAsync();
        }
    }
}
