using pustakalaya_online_book_library.Entities;

namespace pustakalaya_online_book_library.Services.Interfaces
{
    public interface IAuthorService
    {
        Task<IEnumerable<Author>> GetAllAsync();
        Task<Author> GetByIdAsync(Guid id);
        Task<Author> CreateAsync(Author author);
        Task UpdateAsync(Guid id, Author author);
        Task DeleteAsync(Guid id);
    }
}
