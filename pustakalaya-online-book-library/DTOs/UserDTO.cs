using System.ComponentModel.DataAnnotations;

namespace pustakalaya_online_book_library.DTOs
{
    public class UserDTO
    {
        private string userName { get; set; }
        
        private string userEmail { get; set; }
       
        private string userPassword { get; set; }
        
        private string userContact { get; set; }
       
        private string userAddress { get; set; }

        private string profileURL { get; set; }
    }
}
