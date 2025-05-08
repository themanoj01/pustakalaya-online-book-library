using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;
using System.Collections;

namespace pustakalaya_online_book_library.Services.Interfaces
{
    public interface IAnnouncementService
    {
        Task<IEnumerable<Announcement>> GetAllAsync(); 
        Task<Announcement> GetByIdAsync(Guid id);
        Task<Announcement> CreateAsync(AnnouncementCreateDto announcement); 
        Task UpdateAsync(Guid id, AnnouncementUpdateDto announcement); 
        Task DeleteAsync(Guid id);
    }

}
