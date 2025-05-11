using Microsoft.AspNetCore.Mvc;
using pustakalaya_online_book_library.Services.Interfaces;

namespace pustakalaya_online_book_library.Controllers
{
    [ApiController]
    [Route("pustakalaya/wishlist")]
    public class WishListController : Controller
    {
        private IWishListService _wishListService;

        public WishListController(IWishListService wishListService)
        {
            _wishListService = wishListService;
        }

        [HttpPost("toggle-wishlist")]
        public IActionResult AddWishList([FromQuery] Guid UserId, [FromQuery] Guid BookId)
        {
            string response = _wishListService.ToggleWishList(UserId, BookId);
            return Ok(response);
        }
    }
}
