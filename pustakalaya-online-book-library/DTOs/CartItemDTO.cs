namespace pustakalaya_online_book_library.DTOs
{
    public class CartItemDTO
    {
        public Guid BookId { get; set; }
        public string BookTitle { get; set; }

        public int Quantity { get; set; }
    }
}
