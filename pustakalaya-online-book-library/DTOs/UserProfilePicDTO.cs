namespace pustakalaya_online_book_library.DTOs
{
    public class UserProfilePicDTO
    {
        public Guid userId {  get; set; }
        public IFormFile profilePic { get; set; }
    }
}
