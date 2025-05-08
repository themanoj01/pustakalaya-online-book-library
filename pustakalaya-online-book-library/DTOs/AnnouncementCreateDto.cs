using System.ComponentModel.DataAnnotations;

namespace pustakalaya_online_book_library.DTOs
{
    public class AnnouncementCreateDto
    {
        [Required, StringLength(200)]
        public string Title { get; set; }

        [Required, StringLength(2000)]
        public string Content { get; set; }

        public DateTime? ExpiresAt { get; set; }

        [Required]
        public Guid UserId { get; set; }
    }
}
