using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;

namespace pustakalaya_online_book_library.Services.Interfaces
{
    public interface IAuthorService
    {
        Task<IEnumerable<Author>> GetAllAsync();
        Task<Author> GetByIdAsync(Guid id);
        Task<Author> CreateAsync(AuthorCreateDto author);
        Task UpdateAsync(Guid id, AuthorUpdateDto author);
        Task DeleteAsync(Guid id);
    }
}
