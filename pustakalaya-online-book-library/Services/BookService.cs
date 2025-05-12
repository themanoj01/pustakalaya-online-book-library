using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Microsoft.EntityFrameworkCore;
using pustakalaya_online_book_library.Data;
using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;
using pustakalaya_online_book_library.Services.Interfaces;

namespace pustakalaya_online_book_library.Services
{
    public class BookService : IBookService
    {
        private readonly ApplicationDBContext _context;
        private Cloudinary _cloudinary;

        public BookService(ApplicationDBContext context, Cloudinary cloudinary)
        {
            _context = context;
            _cloudinary = cloudinary;
        }
        public async Task<BookReadDto> CreateBookAsync(BookCreateDto dto)
        {
            var authors = await _context.Authors.Where(a => dto.AuthorIds.Contains(a.Id)).ToListAsync();
            var genres = await _context.Genres.Where(g => dto.GenreIds.Contains(g.Id)).ToListAsync();
            if (!authors.Any())
                throw new Exception("No valid authors found for the given IDs.");

            if (!genres.Any())
                throw new Exception("No valid genres found for the given IDs.");

            string imageUrl = null;

            if (dto.BookImage != null && dto.BookImage.Length > 0)
            {
                await using var stream = dto.BookImage.OpenReadStream();

                if (stream == null)
                    throw new Exception("Image stream is null");

                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(dto.BookImage.FileName, stream),
                    Folder = "Pustakalaya/Books"
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult == null || uploadResult.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    throw new Exception("Failed to upload image");
                }

                imageUrl = uploadResult.SecureUrl?.ToString();
            }

            var book = new Book
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                ISBN = dto.ISBN,
                Price = dto.Price,
                Stock = dto.Stock,
                Language = dto.Language,
                Format = dto.Format,
                Publisher = dto.Publisher,
                BookImage = imageUrl,
                PublicationDate = DateTime.SpecifyKind(dto.PublicationDate, DateTimeKind.Utc),
                Description = dto.Description,
                BookAuthors = authors.Select(a => new BookAuthor { AuthorId = a.Id }).ToList(),
                BookGenres = genres.Select(g => new BookGenre { GenreId = g.Id }).ToList(),
                AwardWinner = dto.AwardWinner,
            };

            await _context.Books.AddAsync(book);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine("DB Error: " + dbEx.InnerException?.Message); // or log it
                throw new Exception(("DB Error: " + dbEx.InnerException?.Message));
            }

            var created = await GetBookByIdAsync(book.Id);
            if (created == null)
            {
                throw new Exception("Book creation failed unexpectedly.");
            }
            return created;
        }

        public async Task<bool> DeleteBookAsync(Guid id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                throw new Exception("Book not found.");

            _context.Books.Remove(book);
            var result = await _context.SaveChangesAsync();
            if (result == 0)
                throw new Exception("Failed to delete the book.");
            return true;
        }

        public async Task<IEnumerable<BookReadDto>> GetAllBooksAsync(int pageNumber, int pageSize)
        {
            var query = _context.Books
                .Include(b => b.BookAuthors).ThenInclude(ba => ba.Author)
                .Include(b => b.BookGenres).ThenInclude(bg => bg.Genre)
                .AsQueryable();

            var books = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return books.Select(b => new BookReadDto
            {
                Id = b.Id,
                Title = b.Title,
                ISBN = b.ISBN,
                Price = b.Price,
                Stock = b.Stock,
                Language = b.Language,
                Format = b.Format,
                Publisher = b.Publisher,
                PublicationDate = b.PublicationDate,
                Description = b.Description,
                BookImage = b.BookImage,
                Rating = b.Rating,
                TotalSold = b.TotalSold,
                Authors = b.BookAuthors.Select(ba => ba.Author.Name).ToList(),
                Genres = b.BookGenres.Select(bg => bg.Genre.Name).ToList(),
                AwardWinner = b.AwardWinner,
                DiscountId = b.DiscountId
            });
        }

        public async Task<(IEnumerable<BookReadDto> Books, int TotalCount)> GetBooksByCategoryAsync(
                string? category = null, string? search = null, string? sortBy = null, Guid? genreId = null,
                Guid? authorId = null, string? language = null, string? format = null, string? publisher = null,
                decimal? minPrice = null, decimal? maxPrice = null, double? minRating = null, bool? inStock = null,
                int pageNumber = 1, int pageSize = 10)
                    {
            var query = _context.Books
                .Include(b => b.BookAuthors).ThenInclude(ba => ba.Author)
                .Include(b => b.BookGenres).ThenInclude(bg => bg.Genre)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(b => b.Title.Contains(search) || b.Description.Contains(search) || b.ISBN.Contains(search));
            if (genreId.HasValue)
                query = query.Where(b => b.BookGenres.Any(bg => bg.GenreId == genreId));
            if (authorId.HasValue)
                query = query.Where(b => b.BookAuthors.Any(ba => ba.AuthorId == authorId));
            if (!string.IsNullOrWhiteSpace(language))
                query = query.Where(b => b.Language == language);
            if (!string.IsNullOrWhiteSpace(format))
                query = query.Where(b => b.Format == format);
            if (!string.IsNullOrWhiteSpace(publisher))
                query = query.Where(b => b.Publisher == publisher);
            if (minPrice.HasValue)
                query = query.Where(b => b.Price >= minPrice);
            if (maxPrice.HasValue)
                query = query.Where(b => b.Price <= maxPrice);
            if (minRating.HasValue)
                query = query.Where(b => b.Rating >= minRating);
            if (inStock.HasValue)
                query = query.Where(b => (b.Stock > 0) == inStock);

            var now = DateTime.UtcNow;
            switch (category?.ToLower())
            {
                case "bestsellers":
                    query = query.OrderByDescending(b => b.TotalSold).Take(5);
                    break;
                case "award-winners":
                    query = query.Where(b => b.AwardWinner);
                    break;
                case "new-releases":
                    query = query.Where(b => b.PublicationDate >= now.AddMonths(-3));
                    break;
                case "new-arrivals":
                    query = query.Where(b => b.PublicationDate >= now.AddMonths(-1));
                    break;
                case "coming-soon":
                    query = query.Where(b => b.PublicationDate > now);
                    break;
                case "deals":
                    query = query.Where(b => b.DiscountId.HasValue);
                    break;
                default: 
                    break;
            }

            query = sortBy switch
            {
                "title" => query.OrderBy(b => b.Title),
                "price" => query.OrderBy(b => b.Price),
                "publicationDate" => query.OrderBy(b => b.PublicationDate),
                "popularity" => query.OrderByDescending(b => b.TotalSold),
                _ => query.OrderBy(b => b.Title)
            };

            var totalCount = await query.CountAsync();
            var books = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (books.Select(b => new BookReadDto
            {
                Id = b.Id,
                Title = b.Title,
                ISBN = b.ISBN,
                Price = b.Price,
                Stock = b.Stock,
                Language = b.Language,
                Format = b.Format,
                Publisher = b.Publisher,
                PublicationDate = b.PublicationDate,
                Description = b.Description,
                BookImage = b.BookImage,
                Rating = b.Rating,
                TotalSold = b.TotalSold,
                Authors = b.BookAuthors.Select(ba => ba.Author.Name).ToList(),
                Genres = b.BookGenres.Select(bg => bg.Genre.Name).ToList(),
                AwardWinner = b.AwardWinner
            }), totalCount);
        }


        public async Task<BookReadDto?> GetBookByIdAsync(Guid id)
        {
            var book = await _context.Books
                           .Include(b => b.BookAuthors).ThenInclude(ba => ba.Author)
                           .Include(b => b.BookGenres).ThenInclude(bg => bg.Genre)
                           .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
                throw new Exception("Book not found.");

            return new BookReadDto
            {
                Id = book.Id,
                Title = book.Title,
                ISBN = book.ISBN,
                Price = book.Price,
                Stock = book.Stock,
                Language = book.Language,
                Format = book.Format,
                Publisher = book.Publisher,
                PublicationDate = book.PublicationDate,
                Description = book.Description,
                BookImage = book.BookImage,
                Rating = book.Rating,
                TotalSold = book.TotalSold,
                Authors = book.BookAuthors.Select(ba => ba.Author.Name).ToList(),
                Genres = book.BookGenres.Select(bg => bg.Genre.Name).ToList(),
                AwardWinner = book.AwardWinner
            };
        }

        public async Task<bool> UpdateBookAsync(Guid id, BookUpdateDto dto)
        {
            var book = await _context.Books
               .Include(b => b.BookAuthors)
               .Include(b => b.BookGenres)
               .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
                throw new Exception("Book not found.");

            book.Title = dto.Title;
            book.ISBN = dto.ISBN;
            book.Price = dto.Price;
            book.Stock = dto.Stock;
            book.Language = dto.Language;
            book.Format = dto.Format;
            book.Publisher = dto.Publisher;
            book.PublicationDate = DateTime.SpecifyKind(dto.PublicationDate, DateTimeKind.Utc);
            book.AwardWinner = dto.AwardWinner;

            book.Description = dto.Description;

            book.BookAuthors.Clear();
            foreach (var authorId in dto.AuthorIds)
                book.BookAuthors.Add(new BookAuthor { BookId = id, AuthorId = authorId });

            book.BookGenres.Clear();
            foreach (var genreId in dto.GenreIds)
                book.BookGenres.Add(new BookGenre { BookId = id, GenreId = genreId });

            var result = await _context.SaveChangesAsync();
            if (result == 0)
                throw new Exception("Failed to update book.");
            return true;
        }
        public async Task<bool> AssignDiscountToBookAsync(Guid bookId, Guid discountId)
        {
            var book = await _context.Books.FindAsync(bookId);
            if (book == null) 
                throw new Exception("Book Not Found!");

            var discount = await _context.Discounts.FindAsync(discountId);
            if (discount == null) 
                throw new Exception("Discount not found.");

            book.DiscountId = discountId;
            book.Discount = discount;

            _context.Books.Update(book);
            await _context.SaveChangesAsync();
            return true;
        }
    }
   
}
