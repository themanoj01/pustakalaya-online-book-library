using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pustakalaya_online_book_library.Entities
{
    [Table("Orders")]
    public class Orders
    {
        [Key]
        public Guid OrderId { get; set; }

        [Required]
        public DateTime OrderDate { get; set; }

        [Required]
        [StringLength(10)]
        public string Status { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        public string ClaimCode { get; set; }


        [ForeignKey("User")]
        public Guid UserId { get; set; }
        public virtual Users User { get; set; }
        public virtual ICollection<OrderedProducts> OrderedProducts { get; set; }


        public ICollection<OrderedProducts> OrderedProducts { get; set; }

    }
}
