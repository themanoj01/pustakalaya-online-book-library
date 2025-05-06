using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pustakalaya_online_book_library.Entities
{
    [Table("Users")]
    public class Users
    {
        [Key]
        public Guid userId {  get; set; }
        [Required]
        public string userName { get; set; }
        [Required]
        public string userEmail { get; set; }
        [Required]
        public string userPassword { get; set; }
        [Required]
        public string userContact { get; set; }
        [Required]
        public string userAddress { get; set; }

        public string profileURL { get; set; }
    }
}
