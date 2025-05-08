using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pustakalaya_online_book_library.Entities
{
    [Table("Ordered_Products")]
    public class OrderedProducts
    {
        [Key]
        public Guid OrderedProductId { get; set; }

        [Required]
        public int Quantity { get; set; }

        [ForeignKey("Orders")]
        public Guid OrderId { get; set; }
        public virtual Orders Orders { get; set; }

        [ForeignKey("Books")]
        public Guid BookId { get; set; }
        public virtual Book Book { get; set; }
    }
}
