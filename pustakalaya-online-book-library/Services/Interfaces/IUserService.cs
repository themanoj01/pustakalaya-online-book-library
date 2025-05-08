using pustakalaya_online_book_library.DTOs;
﻿using Microsoft.AspNetCore.Mvc;
using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;

namespace pustakalaya_online_book_library.Services.Interfaces
{
    public interface IUserService
    {
        Task AddUserAsync(UserDTO userDTO);
        void deleteUser(Guid userId);
        Users findByUserId(Guid userId);
        List<Users> getAllUsers();
        string login(LoginDTO loginDTO);
        void updatePassword(Guid userId, UserPasswordDTO userPasswordDTO);
        Task updateProfilePic(UserProfilePicDTO userProfilePicDTO);
        void UpdateUserDetails(UpdateUserDTO userDTO);
    }
}