
namespace pustakalaya_online_book_library.Services.Interfaces
{
    public interface IWishListService
    {
        string ToggleWishList(Guid userId, Guid bookId);
    }
}
