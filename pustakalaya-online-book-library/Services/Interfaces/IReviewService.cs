using pustakalaya_online_book_library.DTOs;

namespace pustakalaya_online_book_library.Services.Interfaces

{
    public interface IReviewService
    {
        Task<ReviewReadDto> CreateReviewAsync(ReviewCreateDto dto);
        Task<IEnumerable<ReviewReadDto>> GetReviewsByBookIdAsync(Guid bookId);
        Task<bool> CanUserReviewAsync(Guid userId, Guid bookId);
    }
}
