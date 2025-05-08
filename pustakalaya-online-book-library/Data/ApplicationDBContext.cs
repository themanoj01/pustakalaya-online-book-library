using Microsoft.EntityFrameworkCore;
using pustakalaya_online_book_library.Entities;

namespace pustakalaya_online_book_library.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options):base(options) { 
        
        }

        public DbSet<Users> Users { get; set; }
        public DbSet<Cart> Carts { get; set; }

        public DbSet<Book> Books { get; set; }
        public DbSet<CartDetails> CartDetails { get; set; }

        public DbSet<Orders> Orders { get; set; }

        public DbSet<OrderedProducts> OrderedProducts { get; set; }

        public DbSet<WishLists> WishLists { get; set; }
    }
}
