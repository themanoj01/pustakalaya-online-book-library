namespace pustakalaya_online_book_library.DTOs
{
    public class OrderDTO
    {
        public Guid OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
        public string ClaimCode { get; set; }
        public Guid UserId {get; set; }
        public string UserName { get; set; }
        public string UserEmail { get; set; }

        public List<OrderItemDTO> OrderedItems { get; set; }
    }
}
