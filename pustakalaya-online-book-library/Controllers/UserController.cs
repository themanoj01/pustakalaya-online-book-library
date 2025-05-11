using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;
using pustakalaya_online_book_library.Services.Interfaces;

namespace pustakalaya_online_book_library.Controllers
{
    
    [ApiController]
    [Route("pustakalaya/users")]  //Request Mapping
    public class UserController : Controller  //Inherit Controller Class
    {
        private IUserService _userService;

        public UserController(IUserService userService)  //Constructor Injection
        {
            _userService = userService;
        }

        //Register Method
        //http://localhost:5198/pustakalaya/users/register
        [HttpPost("register")] //PostMapping
        [Consumes("multipart/form-data")]  //Method Content Type
        public async Task<IActionResult> RegisterUser([FromForm] UserDTO userDTO)
        {
            await _userService.AddUserAsync(userDTO);
            return Ok("User Registered Successfully");
        }


     
        //Login Method
        [HttpPost("login")]  //PostMapping
        public IActionResult LoginUser([FromBody] LoginDTO loginDTO) {
           string token =  _userService.login(loginDTO);
            return Ok(new {token});   // Return jWT Token generate from userService.
        }

        [HttpGet("getAllUser")]  //GetMapping
        public IActionResult GetAllUsers()
        {
            List<Users> users = _userService.getAllUsers();
            return Ok(users);
        }

        [HttpGet("getUserById")]  //GetMapping
        public IActionResult GetUser([FromQuery] Guid userId)
        {
            var user = _userService.findByUserId(userId);
            if (user == null)
                return NotFound("User not found");
            return Ok(user);
        }

        [HttpPut("update-user")]   //PutMapping
        public IActionResult UpdateUser([FromBody] UpdateUserDTO userDTO) {
            _userService.UpdateUserDetails(userDTO);
            return Ok("User Detail Changed Successfully");
        }

        [HttpPatch("update-password")]   //PatchMapping
        public IActionResult UpdatePassword([FromQuery] Guid userId, [FromBody] UserPasswordDTO userPasswordDTO) {
            if (!userPasswordDTO.newPassword.Equals(userPasswordDTO.confirmPassword)) 
            { 
                throw new BadHttpRequestException("New Password and Confirm Password Should be Same"); 
            }
            _userService.updatePassword(userId, userPasswordDTO);
            return Ok("Password Update Successfully");
        }

        [HttpPatch("update-profilePic")] //PatchMapping
        public async Task<IActionResult> UpdateProfilePic([FromForm] UserProfilePicDTO userProfilePicDTO)
        {
            await _userService.updateProfilePic(userProfilePicDTO);
            return Ok("Profile Picture Updated Successfully");
        }

        [HttpDelete("delete-user")]  //Delete Mapping
        public IActionResult DeleteUser([FromQuery] Guid userId)
        {
            _userService.deleteUser(userId);
            return Ok("User Deleted Successfully");
        }

    }
}