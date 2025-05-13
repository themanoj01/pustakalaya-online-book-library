using Microsoft.AspNetCore.Mvc;
using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Services.Interfaces;

namespace pustakalaya_online_book_library.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] ReviewCreateDto dto)
        {
            try
            {
                var review = await _reviewService.CreateReviewAsync(dto);
                return Ok(review);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to create review: {ex.Message}");
            }
        }

        [HttpGet("book/{bookId}")]
        public async Task<IActionResult> GetReviewsByBook(Guid bookId)
        {
            try
            {
                var reviews = await _reviewService.GetReviewsByBookIdAsync(bookId);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to retrieve reviews: {ex.Message}");
            }
        }

        [HttpGet("can-review/{bookId}/{userId}")]
        public async Task<IActionResult> CanReview(Guid bookId, Guid userId)
        {
            try
            {
                var canReview = await _reviewService.CanUserReviewAsync(userId, bookId);
                return Ok(new { CanReview = canReview });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to check review eligibility: {ex.Message}");
            }
        }
    }
}