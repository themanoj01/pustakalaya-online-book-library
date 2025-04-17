using pustakalaya_online_book_library.DTOs;

namespace pustakalaya_online_book_library.Services.Interfaces
{
    public interface IUserService
    {
        void AddUser(UserDTO userDTO);
    }
}
