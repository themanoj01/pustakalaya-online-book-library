﻿using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
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
        private readonly IEmailService _emailService;

        public UserService(ApplicationDBContext context, JwtService jwtService, Cloudinary cloudinary, IEmailService emailService)
        {
            _context = context;
            _jwtService = jwtService;
            _cloudinary = cloudinary;
            _emailService = emailService;
        }

        public async Task AddUserAsync(UserDTO userDTO)
        {


            var existingUser = _context.Users.FirstOrDefault(u => u.UserEmail.Equals(userDTO.userEmail));
            if (existingUser != null)
                if (_context.Users.Any(u => u.UserEmail == userDTO.userEmail))
                {
                    throw new Exception("User already exists");
                }

            string imageUrl = null;

            if (userDTO.profilePic != null && userDTO.profilePic.Length > 0)
            {
                await using var stream = userDTO.profilePic.OpenReadStream();

                if (stream == null)
                    throw new Exception("Image stream is null");

                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(userDTO.profilePic.FileName, stream),
                    Folder = "Pustakalaya/profile_pics"
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult == null || uploadResult.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    throw new Exception("Failed to upload image");
                }

                imageUrl = uploadResult.SecureUrl?.ToString();
            }

            var user = new Users
            {
                UserEmail = userDTO.userEmail,
                UserName = userDTO.userName,
                ProfileURL = imageUrl,
                UserAddress = userDTO.userAddress,
                role = "MEMBER",
                OrderCount = 0,
                UserContact = userDTO.userContact,
                UserPassword = BCrypt.Net.BCrypt.HashPassword(userDTO.userPassword)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            await _emailService.SendEmailAsync(
                toEmail: user.UserEmail,
                subject: "Account Registration",
                body: $@"
                        <html>
                        <head>
                        <style>
                          .container {{
                            font-family: Arial, sans-serif;
                            max-width: 600px;
                            margin: auto;
                            padding: 20px;
                            border: 1px solid #e0e0e0;
                            border-radius: 10px;
                            background-color: #f9f9f9;
                           }}
                        .header {{
                            background-color: #4CAF50;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 10px 10px 0 0;
                            text-align: center;
                            font-size: 24px;
                        }}
                        .content {{
                            padding: 20px;
                            color: #333;
                            font-size: 16px;
                        }}
                        .footer {{
                            margin-top: 20px;
                            font-size: 13px;
                            color: #888;
                            text-align: center;
                        }}
                    </style>
                    </head>
                    <body>
                        <div class='container'>
                            <div class='header'>
                                Welcome to Pustakalaya
                            </div>
                        <div class='content'>
                            <p>Dear <strong>{user.UserName}</strong>,</p>
                            <p>We’re excited to welcome you to <strong>Pustakalaya</strong>! Your account has been successfully registered.</p>
                            <p>You can now explore a wide collection of books and manage your reading list with ease.</p>
                            <p>Happy reading! 📖</p>
                        </div>
                        <div class='footer'>
                            &copy; {DateTime.Now.Year} Pustakalaya Online Book Library
                        </div>
                        </div>
                    </body>
                    </html>"
            );
        }


        public Users findByUserId(Guid userId)
        {
            Users user = _context.Users.FirstOrDefault(x => x.UserId == userId);
            return user;
        }

        public List<Users> getAllUsers()
        {
            return _context.Users.ToList();
        }

        public string login(LoginDTO loginDTO)
        {
            Users user = _context.Users.FirstOrDefault(u => u.UserEmail.Equals(loginDTO.email));
            if (user == null)
            {
                throw new Exception("User Email not Exist");
            }

            if (!BCrypt.Net.BCrypt.Verify(loginDTO.password, user.UserPassword))
            {
                throw new Exception("Password not matched");
            }

            var token = _jwtService.GenerateToken(user);
            return token;
        }

        public async Task UpdateUserDetails(UserDTO userDTO)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserEmail.Equals(userDTO.userEmail));
            if (user == null)
            {
                throw new Exception("User Not Found");
            }

            await _emailService.SendEmailAsync(
                toEmail: user.UserEmail,
                subject: "Account Registration",
                body: $@"
            <html>
            <head>
            <style>
              .container {{
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                background-color: #f9f9f9;
              }}
              .header {{
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                border-radius: 10px 10px 0 0;
                text-align: center;
                font-size: 24px;
              }}
              .content {{
                padding: 20px;
                color: #333;
                font-size: 16px;
              }}
              .footer {{
                margin-top: 20px;
                font-size: 13px;
                color: #888;
                text-align: center;
              }}
            </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        Welcome to Pustakalaya
                    </div>
                    <div class='content'>
                        <p>Dear <strong>{user.UserName}</strong>,</p>
                        <p>We’re excited to welcome you to <strong>Pustakalaya</strong>! Your account has been successfully registered.</p>
                        <p>You can now explore a wide collection of books and manage your reading list with ease.</p>
                        <p>Happy reading! 📖</p>
                    </div>
                    <div class='footer'>
                        &copy; {DateTime.Now.Year} Pustakalaya Online Book Library
                    </div>
                </div>
            </body>
            </html>"
            );
        }


        public async Task updateProfilePic(UserProfilePicDTO userProfilePicDTO)
        {
            var user = _context.Users.FirstOrDefault(user => user.UserId == userProfilePicDTO.userId);
            if (user == null)
            {
                throw new Exception("User Not Found");
            }

            string imageUrl = null;

            if (userProfilePicDTO.profilePic != null && userProfilePicDTO.profilePic.Length > 0)
            {
                await using var stream = userProfilePicDTO.profilePic.OpenReadStream();

                if (stream == null)
                    throw new Exception("Image stream is null");

                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(userProfilePicDTO.profilePic.FileName, stream),
                    Folder = "Pustakalaya/profile_pics"
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult == null || uploadResult.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    throw new Exception("Failed to upload image");
                }

                imageUrl = uploadResult.SecureUrl?.ToString();
            }

            user.ProfileURL = imageUrl;
            _context.SaveChanges();

        }

        public void updatePassword(Guid userId, UserPasswordDTO userPasswordDTO)
        {
            var users = _context.Users.FirstOrDefault(user => user.UserId.Equals(userId));
            if (users == null)
            {
                throw new BadHttpRequestException("User Not Found");
            }
            if (!BCrypt.Net.BCrypt.Verify(userPasswordDTO.oldPassword, users.UserPassword))
            {
                throw new BadHttpRequestException("InCorrect Old Password");
            }
            users.UserPassword = BCrypt.Net.BCrypt.HashPassword(userPasswordDTO.newPassword);
            _context.SaveChanges();
        }



        public void UpdateUserDetails(UpdateUserDTO userDTO)
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.UserEmail.Equals(userDTO.userEmail));
            if (existingUser == null)
            {
                throw new Exception("User Not Found");
            }

            existingUser.UserName = userDTO.userName;
            existingUser.UserAddress = userDTO.userAddress;
            existingUser.UserContact = userDTO.userContact;
            _context.SaveChanges();
        }

        public void deleteUser(Guid userId)
        {
            var user = _context.Users.FirstOrDefault(x => x.UserId == userId);
            if (user == null)
            {
                throw new BadHttpRequestException("User Not Found");
            }

            _context.Users.Remove(user);
            _context.SaveChanges();
        }
    }
}