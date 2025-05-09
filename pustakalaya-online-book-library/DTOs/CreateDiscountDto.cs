using System.ComponentModel.DataAnnotations;

namespace pustakalaya_online_book_library.DTOs
{
    public class CreateDiscountDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        [Required]
        [Range(0, 100)]
        public double DiscountPercent { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
