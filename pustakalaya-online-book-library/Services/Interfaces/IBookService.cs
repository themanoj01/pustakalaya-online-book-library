using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;

namespace pustakalaya_online_book_library.Services.Interfaces
{
    public interface IBookService
    {
        Task<IEnumerable<BookReadDto>> GetAllBooksAsync(
            int pageNumber, int pageSize);
        Task<(IEnumerable<BookReadDto> Books, int TotalCount)> GetBooksByCategoryAsync(
            string? category = null, string? search = null, string? sortBy = null, Guid? genreId = null,
            Guid? authorId = null, string? language = null, string? format = null, string? publisher = null,
            decimal? minPrice = null, decimal? maxPrice = null, double? minRating = null, bool? inStock = null,
            int pageNumber = 1, int pageSize = 10);
        Task<BookReadDto?> GetBookByIdAsync(Guid id);
        Task<BookReadDto> CreateBookAsync(BookCreateDto dto);
        Task<bool> UpdateBookAsync(Guid id, BookUpdateDto dto);
        Task<bool> DeleteBookAsync(Guid id);
        Task<bool> AssignDiscountToBookAsync(Guid bookId, Guid discountId);
    }
}
