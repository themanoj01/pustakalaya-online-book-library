using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;

namespace pustakalaya_online_book_library.Services.Interfaces
{
    public interface IBookService
    {
        Task<IEnumerable<BookReadDto>> GetAllBooksAsync(string? search, string? sortBy, Guid? genreId, Guid? authorId,
            string? language, string? format, string? publisher,
            decimal? minPrice, decimal? maxPrice,
            double? minRating,
            bool? inStock,
            int pageNumber, int pageSize);

        Task<BookReadDto?> GetBookByIdAsync(Guid id);
        Task<BookReadDto> CreateBookAsync(BookCreateDto dto);
        Task<bool> UpdateBookAsync(Guid id, BookUpdateDto dto);
        Task<bool> DeleteBookAsync(Guid id);
    }
}
