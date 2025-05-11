
namespace pustakalaya_online_book_library.Services.Interfaces
{
    public interface IWishListService
    {
        List<Guid> GetWishListByUserId(Guid userId);
        string ToggleWishList(Guid userId, Guid bookId);
    }
}
