using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pustakalaya_online_book_library.Entities
{
    [Table("CartDetails")]
    public class CartDetails
    {
        [Key]
        public Guid CartDetailId { get; set; }

        [Required]
        public int Quantity { get; set; }

        [ForeignKey("Cart")]
        public Guid CartId { get; set; }
        public virtual Cart Cart { get; set; }

        [ForeignKey("Book")]
        public Guid BookId { get; set; }
        public virtual Book Book { get; set; }
    }
}
