using Microsoft.AspNetCore.Mvc;
using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;
using pustakalaya_online_book_library.Services.Interfaces;

namespace pustakalaya_online_book_library.Controllers
{
    [ApiController]
    [Route("/api/users")]
    public class UserController : Controller
    {
        private IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("/register")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> RegisterUser([FromForm] UserDTO userDTO)
        {
            await _userService.AddUserAsync(userDTO);
            return Ok("User Registered Successfully");
        }


        [HttpPost("/login")]
        public IActionResult LoginUser([FromBody] LoginDTO loginDTO)
        {
            string token = _userService.login(loginDTO);
            return Ok(new { token });
        }

        [HttpGet("/getAllUser")]
        public IActionResult GetAllUsers()
        {
            List<Users> users = _userService.getAllUsers();
            return Ok(users);
        }

        [HttpGet("/getUserById/userId")]
        public IActionResult GetUser([FromQuery] Guid userId)
        {
            Users user = _userService.findByUserId(userId);
            return Ok(user);
        }

        [HttpPut("/update-user")]
        public IActionResult UpdateUser([FromBody] UserDTO userDTO)
        {
            _userService.UpdateUserDetails(userDTO);
            return Ok("User Detail Changed Successfully");
        }
    }
}