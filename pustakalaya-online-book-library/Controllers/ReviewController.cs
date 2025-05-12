
using Microsoft.AspNetCore.Mvc;
using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Services.Interfaces;

namespace pustakalaya_online_book_library.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost]
        public async Task<IActionResult> PostReview([FromBody] ReviewCreateDto dto)
        {
            try
            {
                await _reviewService.CreateReviewAsync(dto);
                return Ok("Review submitted successfully.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpGet("book/{bookId}")]
        public async Task<IActionResult> GetReviewsByBookId(Guid bookId)
        {
            try
            {
                var reviews = await _reviewService.GetReviewsByBookIdAsync(bookId);
                return Ok(reviews);
            }
            catch (Exception)
            {
                return StatusCode(500, "Failed to fetch reviews.");
            }
        }
    }

}
