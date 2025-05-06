using Microsoft.EntityFrameworkCore;
using pustakalaya_online_book_library.Data;
using pustakalaya_online_book_library.Entities;
using pustakalaya_online_book_library.Services.Interfaces;
using System.Collections;

namespace pustakalaya_online_book_library.Services
{
    public class AnnouncementService : IAnnouncementService

    {
        private readonly ApplicationDBContext _context;
        public AnnouncementService(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Announcement> CreateAsync(Announcement announcement)
        {
            if (!await _context.Users.AnyAsync(u => u.UserId == announcement.UserId))
                throw new KeyNotFoundException($"User with ID {announcement.UserId} not found.");
            _context.Announcements.Add(announcement);
            await _context.SaveChangesAsync();
            return announcement;
        }

        public async Task DeleteAsync(Guid id)
        {
            var announcement = await _context.Announcements.FirstOrDefaultAsync(a => a.Id == id);
            if (announcement == null)
                throw new KeyNotFoundException($"Announcement with ID {id} not found.");
            _context.Announcements.Remove(announcement);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Announcement>> GetAllAsync() =>
            await _context.Announcements
                .Include(a => a.CreatedBy)
                .ToListAsync();

        public async Task<Announcement> GetByIdAsync(Guid id)
        {
            var announcement = await _context.Announcements
                .Include(a => a.CreatedBy)
                .FirstOrDefaultAsync(a => a.Id == id);
            if (announcement == null)
                throw new KeyNotFoundException($"Announcement with ID {id} not found.");
            return announcement;
        }

        public async Task UpdateAsync(Guid id, Announcement announcement)
        {
            var existing = await _context.Announcements.FirstOrDefaultAsync(a => a.Id == id);
            if (existing == null)
                throw new KeyNotFoundException($"Announcement with ID {id} not found.");
            if (!await _context.Users.AnyAsync(u => u.UserId == announcement.UserId))
                throw new KeyNotFoundException($"User with ID {announcement.UserId} not found.");
            existing.Title = announcement.Title;
            existing.Content = announcement.Content;
            existing.ExpiresAt = announcement.ExpiresAt;
            await _context.SaveChangesAsync();
        }

    }
}
