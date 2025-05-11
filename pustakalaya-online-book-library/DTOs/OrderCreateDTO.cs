using System.ComponentModel.DataAnnotations;

namespace pustakalaya_online_book_library.DTOs
{
    public class OrderCreateDTO
    {
        [Required]
        public Guid UserId { get; set; }


        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        public List<OrderedProductDTO> Products { get; set; }
    }
}
