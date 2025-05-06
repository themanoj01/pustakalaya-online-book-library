using pustakalaya_online_book_library.Data;
using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Services.Interfaces;

namespace pustakalaya_online_book_library.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDBContext _context;

        public UserService(ApplicationDBContext context)
        {
            _context = context;
        }

       public void AddUser(UserDTO userDTO)
        {
            /*var existingUser = _context.Users.FirstOrDefault(u => u.userEmail == userDTO.userEmail);*/

        }
    }
}
