using Microsoft.AspNetCore.Mvc;
using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;
using pustakalaya_online_book_library.Services.Interfaces;

namespace pustakalaya_online_book_library.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenreController : ControllerBase
    {
        private readonly IGenreService _genreService;

        public GenreController(IGenreService genreService)
        {
            _genreService = genreService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll() =>
            Ok(await _genreService.GetAllAsync());

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var genre = await _genreService.GetByIdAsync(id);
                return Ok(genre);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Create([FromBody] GenreCreateDto genreDto)
        {
            try
            {
                var created = await _genreService.CreateAsync(genreDto);
                return Ok(created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] GenreUpdateDto genreDto)
        {
            try
            {
                await _genreService.UpdateAsync(id, genreDto);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _genreService.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
