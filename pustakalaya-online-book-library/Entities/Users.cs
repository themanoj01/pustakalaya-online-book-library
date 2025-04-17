using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pustakalaya_online_book_library.Entities
{
    [Table("Users")]
    public class Users
    {
        [Key]
        private Guid userId {  get; set; }
        [Required]
        private string userName { get; set; }
        [Required]
        private string userNmail { get; set; }
        [Required]
        private string userPassword { get; set; }
        [Required]
        private string userContact { get; set; }
        [Required]
        private string userAddress { get; set; }

        private string profileURL { get; set; }
    }
}
