using System.ComponentModel.DataAnnotations;

namespace pustakalaya_online_book_library.DTOs
{
    public class AuthorUpdateDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
    }
}
