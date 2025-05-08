using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pustakalaya_online_book_library.Entities
{
    [Table("Cart")]
    public class Cart
    {
        [Key]
        public Guid CartId { get; set; }

        [ForeignKey("User")]
        public Guid UserId { get; set; }
        public virtual Users User { get; set; }
        public virtual ICollection<CartDetails> CartDetails { get; set; }

    }
}
