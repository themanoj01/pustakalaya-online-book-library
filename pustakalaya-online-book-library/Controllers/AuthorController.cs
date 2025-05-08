using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;
using pustakalaya_online_book_library.Services.Interfaces;

namespace pustakalaya_online_book_library.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorController : ControllerBase
    {
        private readonly IAuthorService _authorService;

        public AuthorController(IAuthorService authorService)
        {
            _authorService = authorService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll() =>
            Ok(await _authorService.GetAllAsync());

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var author = await _authorService.GetByIdAsync(id);
                return Ok(author);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Create([FromBody] AuthorCreateDto author)
        {
            try
            {
                var created = await _authorService.CreateAsync(author);
                return Ok(created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] AuthorUpdateDto author)
        {
            try
            {
                await _authorService.UpdateAsync(id, author);
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
                await _authorService.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
