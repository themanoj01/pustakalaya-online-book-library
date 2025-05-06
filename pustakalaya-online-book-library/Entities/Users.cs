using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pustakalaya_online_book_library.Entities
{
    [Table("Users")]
    public class Users
    {
        [Key]
        public Guid UserId {  get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string UserEmail { get; set; }
        [Required]
        public string userPassword { get; set; }
        [Required]
        public string userContact { get; set; }
        [Required]
        public string userAddress { get; set; }

        public string profileURL { get; set; }
    }
}
