
using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;
using System.Collections;

namespace pustakalaya_online_book_library.Services.Interfaces

{
    public interface IReviewService
    {
        Task CreateReviewAsync(ReviewCreateDto dto);
        Task<IEnumerable<ReviewReadDto>> GetReviewsByBookIdAsync(Guid bookId);

    }
}
