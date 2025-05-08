using System.ComponentModel.DataAnnotations;

namespace pustakalaya_online_book_library.DTOs
{
    public class ReviewCreateDto
    {
        [Required]
        public Guid BookId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required, Range(1, 5)]
        public int Rating { get; set; }

        [StringLength(1000)]
        public string Comment { get; set; }
    }
}
