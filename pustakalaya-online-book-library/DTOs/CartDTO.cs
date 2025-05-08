using System.ComponentModel.DataAnnotations;

namespace pustakalaya_online_book_library.DTOs
{
    public class CartDTO
    {
        [Required]
        public Guid UserId { get; set; }

        [Required]
        public List<CartDetailDTO> Items { get; set; }
    }
}
