using System.ComponentModel.DataAnnotations;

namespace pustakalaya_online_book_library.DTOs
{
    public class AssignDiscountDto
    {
        [Required]
        public Guid BookId { get; set; }
        [Required]
        public Guid DiscountId { get; set; }
    }

}
