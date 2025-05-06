using pustakalaya_online_book_library.Data;
using pustakalaya_online_book_library.Entities;
using pustakalaya_online_book_library.Services.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace pustakalaya_online_book_library.Services
{
    public class AuthorService : IAuthorService
    {
        private readonly ApplicationDBContext _context;

        public AuthorService(ApplicationDBContext context)
        {
            _context = context;
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
        public async Task<Author> CreateAsync(Author author)
        {
            if (await _context.Authors.AnyAsync(a => a.Name == author.Name))
                throw new InvalidOperationException($"Author with name '{author.Name}' already exists.");
            _context.Authors.Add(author);
            await _context.SaveChangesAsync();
            var created = await GetByIdAsync(author.Id);
            if (created == null)
            {
                throw new Exception("Author creation failed unexpectedly.");
            }
            return created;
        }

        public async Task UpdateAsync(Guid id, Author author)
        {
            var existing = await _context.Authors.FindAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"Author with ID {id} not found.");
            if (await _context.Authors.AnyAsync(a => a.Name == author.Name && a.Id != id))
                throw new InvalidOperationException($"Author with name '{author.Name}' already exists.");
            existing.Name = author.Name;
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
