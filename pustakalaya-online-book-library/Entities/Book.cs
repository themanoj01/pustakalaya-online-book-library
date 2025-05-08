using System.ComponentModel.DataAnnotations;

namespace pustakalaya_online_book_library.Entities
{
    public class Book
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [Required]
        [StringLength(13)]
        public string ISBN { get; set; }

        public decimal Price { get; set; }

        [Range(0, int.MaxValue)]
        public int Stock { get; set; } = 0;

        [StringLength(50)]
        public string Language { get; set; }

        [StringLength(50)]

        public string Format { get; set; }

        [StringLength(100)]
        public string Publisher { get; set; }

        public DateTime PublicationDate { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        public double Rating { get; set; } = 0.0;

        public int TotalSold { get; set; } = 0;
        public ICollection<BookAuthor> BookAuthors { get; set; }
        public ICollection<BookGenre> BookGenres { get; set; }
        public List<Review> Reviews { get; set; } = new List<Review>();

   
       

        public ICollection<CartDetails> CartDetails { get; set; }

        public ICollection<Book> Books { get; set; }
    }
}
