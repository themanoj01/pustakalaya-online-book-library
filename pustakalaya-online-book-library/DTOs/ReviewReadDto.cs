namespace pustakalaya_online_book_library.DTOs
{
    public class ReviewReadDto
    {
        public Guid UserId { get; set; }
        public string Username { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
