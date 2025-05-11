using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace pustakalaya_online_book_library.DTOs
{
    public class BookCreateDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } 

        [Required]
        [StringLength(13)]
        public string ISBN { get; set; }
        public decimal Price { get; set; }

        [Range(0, int.MaxValue)]
        public int Stock { get; set; }

        [StringLength(50)]
        public string Language { get; set; }

        [StringLength(50)]
        public string Format { get; set; }

        [StringLength(100)]
        public string Publisher { get; set; }

        public DateTime PublicationDate { get; set; }

        [StringLength(1000)]
        public string? Description { get; set; }

        public IFormFile? BookImage { get; set; }

        public List<Guid>? AuthorIds { get; set; }
        public List<Guid>? GenreIds { get; set; }
    }
}
