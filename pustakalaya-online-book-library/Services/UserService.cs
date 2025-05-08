using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pustakalaya_online_book_library.Data;
using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;
using pustakalaya_online_book_library.Services.Interfaces;

namespace pustakalaya_online_book_library.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDBContext _context;
        private readonly JwtService _jwtService;
        private readonly Cloudinary _cloudinary;

        public UserService(ApplicationDBContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task AddUserAsync(UserDTO userDTO)
        {
            string imageUrl = null;

            var existingUser = _context.Users.FirstOrDefault(u => u.userEmail.Equals(userDTO.userEmail));
            if (existingUser != null)
            {
                throw new Exception("User already exists");
            }



            var user = new Users
            {
                userEmail = userDTO.userEmail,
                userName = userDTO.userName,
                profileURL = imageUrl,
                userAddress = userDTO.userAddress,
                userContact = userDTO.userContact,
                userPassword = BCrypt.Net.BCrypt.HashPassword(userDTO.userPassword)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }


        public Users findByUserId(Guid userId)
        {
            Users user = _context.Users.FirstOrDefault(x => x.userId == userId);
            return user;
        }

        public List<Users> getAllUsers()
        {
            return _context.Users.ToList();
        }

        public string login(LoginDTO loginDTO)
        {
            Users user = _context.Users.FirstOrDefault(u => u.userEmail.Equals(loginDTO.email));
            if (user == null)
            {
                throw new Exception("User Email not Exist");
            }

            if (!BCrypt.Net.BCrypt.Verify(loginDTO.password, user.userPassword))
            {
                throw new Exception("Password not matched");
            }

            var token = _jwtService.GenerateToken(user);
            return token;
        }

        public void UpdateUserDetails(UserDTO userDTO)
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.userEmail.Equals(userDTO.userEmail));
            if (existingUser == null)
            {
                throw new Exception("User Not Found");
            }

            existingUser.userName = userDTO.userName;
            existingUser.userAddress = userDTO.userAddress;
            existingUser.userContact = userDTO.userContact;
            _context.SaveChanges();
        }
    }
}