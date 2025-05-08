using pustakalaya_online_book_library.Data;
using pustakalaya_online_book_library.Entities;
using pustakalaya_online_book_library.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using pustakalaya_online_book_library.DTOs;


namespace pustakalaya_online_book_library.Services
{
    public class AuthorService : IAuthorService
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public AuthorService(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Author>> GetAllAsync() =>
            await _context.Authors.ToListAsync();

        public async Task<Author> GetByIdAsync(Guid id)
        {
            var author = await _context.Authors.FindAsync(id);
            if (author == null)
                throw new KeyNotFoundException($"Author with ID {id} not found.");
            return author;
        }
        public async Task<Author> CreateAsync(AuthorCreateDto authorDto)
        {
            if (await _context.Authors.AnyAsync(a => a.Name == authorDto.Name))
                throw new InvalidOperationException($"Author with name '{authorDto.Name}' already exists.");
            var author = _mapper.Map<Author>(authorDto);
            _context.Authors.Add(author);
            await _context.SaveChangesAsync();
            var created = await GetByIdAsync(author.Id);
            if (created == null)
            {
                throw new Exception("Author creation failed unexpectedly.");
            }
            return created;
        }

        public async Task UpdateAsync(Guid id, AuthorUpdateDto authorDto)
        {
            var existing = await _context.Authors.FindAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"Author with ID {id} not found.");
            if (await _context.Authors.AnyAsync(a => a.Name == authorDto.Name && a.Id != id))
                throw new InvalidOperationException($"Author with name '{authorDto.Name}' already exists.");

            _mapper.Map(authorDto, existing);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(Guid id)
        {
            var author = await _context.Authors.FindAsync(id);
            if (author == null)
                throw new KeyNotFoundException($"Author with ID {id} not found.");
            _context.Authors.Remove(author);
            await _context.SaveChangesAsync();
        }
    }
}
