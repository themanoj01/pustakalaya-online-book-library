using Microsoft.AspNetCore.Mvc;
using pustakalaya_online_book_library.DTOs;
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
        public IActionResult RegisterUser([FromBody] UserDTO userDTO)
        {
            _userService.AddUser(userDTO);
        }
    }
}
