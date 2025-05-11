using pustakalaya_online_book_library.Data;
using pustakalaya_online_book_library.Entities;

namespace pustakalaya_online_book_library.Services
{
    public static class Seed
    {
        public static void SeedAdminUser(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();

            if (!context.Users.Any(u => u.UserEmail == "admin@gmail.com"))
            {
                var admin = new Users
                {
                    UserId = Guid.NewGuid(),
                    UserName = "Admin",
                    UserEmail = "admin@gmail.com",
                    UserPassword = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    role = "ADMIN",
                    UserAddress = "Pustakalaya HQ",
                    UserContact = "9800000000",
                    OrderCount = 0,
                    ProfileURL = null
                };

                context.Users.Add(admin);
                context.SaveChanges();
            }
        }
    }

}
