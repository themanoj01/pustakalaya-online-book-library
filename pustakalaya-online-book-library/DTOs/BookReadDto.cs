namespace pustakalaya_online_book_library.DTOs
{
    public class BookReadDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string ISBN { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string Language { get; set; }
        public string Format { get; set; }
        public string Publisher { get; set; }
        public DateTime PublicationDate { get; set; }
        public string Description { get; set; }
        public double Rating { get; set; }
        public int TotalSold { get; set; }
        public List<string> Authors { get; set; }
        public List<string> Genres { get; set; }
    }
}
