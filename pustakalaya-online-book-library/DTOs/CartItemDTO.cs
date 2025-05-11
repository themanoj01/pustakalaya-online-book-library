using pustakalaya_online_book_library.Entities;

namespace pustakalaya_online_book_library.DTOs
{
    public class CartItemDTO
    {
        public Guid BookId { get; set; }
        public string BookTitle { get; set; }

        public decimal Price { get; set; }
        public string BookImage { get; set; }
        public string Author { get; set; }

        public int Quantity { get; set; }
    }
}
