namespace pustakalaya_online_book_library.DTOs
{
    public class CartResponseDTO
    {
        public Guid CartId { get; set; }
        public Guid UserId { get; set; }
        public List<CartItemDTO> Items { get; set; }
    }
}
