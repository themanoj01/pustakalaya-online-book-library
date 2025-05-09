using AutoMapper;
using Microsoft.EntityFrameworkCore;
using pustakalaya_online_book_library.Data;
using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;
using pustakalaya_online_book_library.Services.Interfaces;
using System.Collections;

namespace pustakalaya_online_book_library.Services
{
    public class AnnouncementService : IAnnouncementService

    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public AnnouncementService(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Announcement> CreateAsync(AnnouncementCreateDto announcementDto)
        {
            if (!await _context.Users.AnyAsync(u => u.UserId == announcementDto.UserId))
                throw new KeyNotFoundException($"User with ID {announcementDto.UserId} not found.");
            var announcement = _mapper.Map<Announcement>(announcementDto);
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

        public async Task UpdateAsync(Guid id, AnnouncementUpdateDto announcementDto)
        {
            var existing = await _context.Announcements.FirstOrDefaultAsync(a => a.Id == id);
            if (existing == null)
                throw new KeyNotFoundException($"Announcement with ID {id} not found.");

            _mapper.Map(announcementDto, existing);

            await _context.SaveChangesAsync();
        }


    }
}
