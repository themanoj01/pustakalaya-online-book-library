using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;

namespace pustakalaya_online_book_library.Services.Interfaces
{
    public interface IUserService
    {
        Task AddUserAsync(UserDTO userDTO);
        Users findByUserId(Guid userId);
        List<Users> getAllUsers();
        string login(LoginDTO loginDTO);
        void UpdateUserDetails(UserDTO userDTO);
    }
}