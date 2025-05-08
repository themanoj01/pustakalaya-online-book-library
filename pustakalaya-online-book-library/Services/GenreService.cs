using pustakalaya_online_book_library.Data;
using pustakalaya_online_book_library.Entities;
using pustakalaya_online_book_library.Services.Interfaces;

using Microsoft.EntityFrameworkCore;
using pustakalaya_online_book_library.DTOs;
using AutoMapper;

namespace pustakalaya_online_book_library.Services
{
    public class GenreService : IGenreService
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public GenreService(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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

        public async Task<Genre> CreateAsync(GenreCreateDto genreDto)
        {
            if (await _context.Genres.AnyAsync(g => g.Name == genreDto.Name))
                throw new InvalidOperationException($"Genre with name '{genreDto.Name}' already exists.");

            var genre = _mapper.Map<Genre>(genreDto);   

            _context.Genres.Add(genre);
            await _context.SaveChangesAsync();

            var created = await GetByIdAsync(genre.Id);
            if (created == null)
            {
                throw new Exception("Genre creation failed unexpectedly.");
            }

            return created;
        }


        public async Task UpdateAsync(Guid id, GenreUpdateDto genreDto)
        {
            var existing = await _context.Genres.FindAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"Genre with ID {id} not found.");
            if (await _context.Genres.AnyAsync(g => g.Name == genreDto.Name && g.Id != id))
                throw new InvalidOperationException($"Genre with name '{genreDto.Name}' already exists.");
            _mapper.Map(genreDto, existing);
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
