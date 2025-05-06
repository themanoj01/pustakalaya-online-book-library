using System.ComponentModel.DataAnnotations;

namespace pustakalaya_online_book_library.Entities
{
    public class Announcement
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required, StringLength(200)]
        public string Title { get; set; }

        [Required, StringLength(2000)]
        public string Content {  get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ExpiresAt { get; set; }
        [Required]
        public Guid UserId { get; set; }
        public Users CreatedBy { get; set; }

    }
}
