using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace pustakalaya_online_book_library.Entities
{
    [Table("Users")]
    public class Users
    {
        [Key]
        public Guid UserId { get; set; }

        [Required]
        public string UserName { get; set; }
        [Required]
        public string UserEmail { get; set; }
        [Required]
        [JsonIgnore]
        public string UserPassword { get; set; }
        [Required]

        public List<Review> Reviews { get; set; } = new List<Review>();

        [StringLength(10, MinimumLength = 10)]
        public string UserContact { get; set; }
        [Required]
        public string UserAddress { get; set; }

        public string ProfileURL { get; set; }

        public int OrderCount { get; set; }
        
        public string role { get; set; }
        public virtual Cart Cart { get; set; }

        public virtual ICollection<WishLists> WishLists { get; set; }
    }
}