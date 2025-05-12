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
                Console.WriteLine($"Received AwardWinner: {dto.AwardWinner}"); 
                var createdBook = await _bookService.CreateBookAsync(dto);
                return Ok(createdBook);
            }
            catch (Exception ex)
            {
                return BadRequest( $"Book creation failed: {ex.Message}");
            }
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllBooks(int pageNumber = 1, int pageSize = 10)
        {
            try
            {
                var books = await _bookService.GetAllBooksAsync(pageNumber, pageSize);
                return Ok(books);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to retrieve books: {ex.Message}");
            }
        }

        [HttpGet("category")]
        public async Task<IActionResult> GetBooksByCategory(
                [FromQuery] string? category = null, [FromQuery] string? search = null,
                [FromQuery] string? sortBy = null, [FromQuery] Guid? genreId = null,
                [FromQuery] Guid? authorId = null, [FromQuery] string? language = null,
                [FromQuery] string? format = null, [FromQuery] string? publisher = null,
                [FromQuery] decimal? minPrice = null, [FromQuery] decimal? maxPrice = null,
                [FromQuery] double? minRating = null, [FromQuery] bool? inStock = null,
                [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var (books, totalCount) = await _bookService.GetBooksByCategoryAsync(
                category, search, sortBy, genreId, authorId, language, format, publisher,
                minPrice, maxPrice, minRating, inStock, pageNumber, pageSize);
            return Ok(new { books, totalCount });
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateBook(Guid id, [FromBody] BookUpdateDto dto)
        {
            try
            {
                Console.WriteLine($"Received AwardWinner: {dto.AwardWinner}"); 
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

        [HttpPost("assign-discount")]
        public async Task<IActionResult> AssignDiscount([FromBody] AssignDiscountDto dto)
        {
            var success = await _bookService.AssignDiscountToBookAsync(dto.BookId, dto.DiscountId);
            if (!success)
                return NotFound("Book or Discount not found.");

            return Ok("Discount assigned successfully.");
        }


    }
}
