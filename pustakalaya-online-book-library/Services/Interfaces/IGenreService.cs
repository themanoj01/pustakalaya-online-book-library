using pustakalaya_online_book_library.Entities;

namespace pustakalaya_online_book_library.Services.Interfaces
{
    public interface IGenreService
    {
        Task<IEnumerable<Genre>> GetAllAsync();
        Task<Genre?> GetByIdAsync(Guid id);
        Task<Genre> CreateAsync(Genre genre);
        Task UpdateAsync(Guid id, Genre genre);
        Task DeleteAsync(Guid id);
    }
}
