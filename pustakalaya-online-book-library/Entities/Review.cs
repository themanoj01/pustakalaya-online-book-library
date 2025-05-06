using System.ComponentModel.DataAnnotations;

namespace pustakalaya_online_book_library.Entities
{
    public class Review
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid BookId { get; set; }
        public Book Book { get; set; }

        [Required]
        public Guid UserId { get; set; }
        public Users User { get; set; }

        [Required, Range(1, 5)]
        public int Rating { get; set; }

        [StringLength(1000)]
        public string Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

