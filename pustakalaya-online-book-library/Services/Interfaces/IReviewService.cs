
using pustakalaya_online_book_library.Entities;
using System.Collections;

namespace pustakalaya_online_book_library.Services.Interfaces

{
    public interface IReviewService
    {
        Task<IEnumerable<Review>> GetAllAsync();
        Task<IEnumerable<Review>> GetByBookIdAsync(Guid bookId);
        Task<Review> GetByIdAsync(Guid id);
        Task<Review> CreateAsync(Review review);
        Task UpdateAsync(Guid id, Review review);
        Task DeleteAsync(Guid id);
    }
}
