using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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
        [JsonIgnore]
        public string userPassword { get; set; }
        [Required]
        [StringLength(10, MinimumLength = 10)]
        public string userContact { get; set; }
        [Required]
        public string userAddress { get; set; }

        public string profileURL { get; set; }

        public virtual Cart Cart { get; set; }

        public virtual ICollection<WishLists> WishLists { get; set; }
    }
}
