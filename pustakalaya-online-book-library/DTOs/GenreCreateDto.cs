using System.ComponentModel.DataAnnotations;

namespace pustakalaya_online_book_library.DTOs
{
    public class GenreCreateDto
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; }
    }
}
