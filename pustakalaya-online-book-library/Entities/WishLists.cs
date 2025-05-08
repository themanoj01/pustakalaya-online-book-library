using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pustakalaya_online_book_library.Entities
{
    [Table("Wishlists")]
    public class WishLists
    {
        [Key]
        public Guid WishListId { get; set; }

        [ForeignKey("User")]
        public Guid UserId { get; set; }
        public virtual Users User { get; set; }

        [ForeignKey("Book")]
        public Guid BookId { get; set; }
        public virtual Book Book { get; set; }
    }
}
