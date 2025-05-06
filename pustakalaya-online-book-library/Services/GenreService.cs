using pustakalaya_online_book_library.Data;
using pustakalaya_online_book_library.Entities;
using pustakalaya_online_book_library.Services.Interfaces;

using Microsoft.EntityFrameworkCore;

namespace pustakalaya_online_book_library.Services
{
    public class GenreService : IGenreService
    {
        private readonly ApplicationDBContext _context;

        public GenreService(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Genre>> GetAllAsync() =>
            await _context.Genres.ToListAsync();

        public async Task<Genre> GetByIdAsync(Guid id)
        {
            var genre = await _context.Genres.FindAsync(id);
            if (genre == null)
                throw new KeyNotFoundException($"Genre with ID {id} not found.");
            return genre;
        }

        public async Task<Genre> CreateAsync(Genre genre)
        {
            if (await _context.Genres.AnyAsync(g => g.Name == genre.Name))
                throw new InvalidOperationException($"Genre with name '{genre.Name}' already exists.");
            _context.Genres.Add(genre);
            await _context.SaveChangesAsync();
            var created = await GetByIdAsync(genre.Id);
            if (created == null)
            {
                throw new Exception("Genre creation failed unexpectedly.");
            }
            return created;
        }

        public async Task UpdateAsync(Guid id, Genre genre)
        {
            var existing = await _context.Genres.FindAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"Genre with ID {id} not found.");
            if (await _context.Genres.AnyAsync(g => g.Name == genre.Name && g.Id != id))
                throw new InvalidOperationException($"Genre with name '{genre.Name}' already exists.");
            existing.Name = genre.Name;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var genre = await _context.Genres.FindAsync(id);
            if (genre == null)
                throw new KeyNotFoundException($"Genre with ID {id} not found.");
            _context.Genres.Remove(genre);
            await _context.SaveChangesAsync();
        }
    }
}
