using System.ComponentModel.DataAnnotations;

namespace pustakalaya_online_book_library.DTOs
{
    public class AuthorCreateDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
    }
}
