using System.ComponentModel.DataAnnotations;

namespace pustakalaya_online_book_library.DTOs
{
    public class UserDTO
    {
        public string userName { get; set; }

        public string userEmail { get; set; }

        public string userPassword { get; set; }

        public string userContact { get; set; }

        public string userAddress { get; set; }

        public IFormFile proPic { get; set; }
    }
}