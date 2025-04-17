using Microsoft.EntityFrameworkCore;
using pustakalaya_online_book_library.Entities;

namespace pustakalaya_online_book_library.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options):base(options) { 
        
        }

        public DbSet<Users> Users { get; set; }
    }
}
