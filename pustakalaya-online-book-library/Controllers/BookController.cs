using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Services.Interfaces;

namespace pustakalaya_online_book_library.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;
        public BookController(IBookService bookService)
        {
             _bookService = bookService;
        }
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetBookById(Guid id)
        {
            try
            {
                var book = await _bookService.GetBookByIdAsync(id);
                return Ok(book);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
        [HttpPost("Add")]
        public async Task<IActionResult> CreateBook([FromForm] BookCreateDto dto)
        {
            try
            {
                var createdBook = await _bookService.CreateBookAsync(dto);
                return Ok(createdBook);
            }
            catch (Exception ex)
            {
                return BadRequest( $"Book creation failed: {ex.Message}");
            }
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllBooks(
            string? search, string? sortBy, Guid? genreId, Guid? authorId,
            string? language, string? format, string? publisher,
            decimal? minPrice, decimal? maxPrice, double? minRating,
            bool? inStock,
            int pageNumber = 1, int pageSize = 10)
        {
            try
            {
                var books = await _bookService.GetAllBooksAsync(search, sortBy, genreId, authorId,
                    language, format, publisher, minPrice, maxPrice, minRating,
                     inStock, pageNumber, pageSize);
                return Ok(books);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to retrieve books: {ex.Message}");
            }
        }
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateBook(Guid id, [FromBody] BookUpdateDto dto)
        {
            try
            {
                var success = await _bookService.UpdateBookAsync(id, dto);
                return success ? NoContent() : BadRequest("Update failed.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to update book: {ex.Message}");
            }
        }
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteBook(Guid id)
        {
            try
            {
                var success = await _bookService.DeleteBookAsync(id);
                return success ? NoContent() : BadRequest("Delete failed.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to delete book: {ex.Message}");
            }
        }

    }
}
