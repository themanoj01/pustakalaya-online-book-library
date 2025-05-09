using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;

namespace pustakalaya_online_book_library.Services.Interfaces
{
    public interface IDiscountService
    {
        Task<IEnumerable<Discount>> GetAllAsync();
        Task<Discount> GetByIdAsync(Guid id);
        Task<Discount> CreateAsync(CreateDiscountDto discount);
        Task UpdateAsync(Guid id, UpdateDiscountDto discount);
        Task DeleteAsync(Guid id);
    }
}
