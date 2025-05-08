namespace pustakalaya_online_book_library.DTOs
{
    public class UserPasswordDTO
    {
        public string oldPassword {  get; set; }
        public string newPassword { get; set; }
        public string confirmPassword { get; set; }
    }
}
