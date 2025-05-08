using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;
using pustakalaya_online_book_library.Services.Interfaces;

namespace pustakalaya_online_book_library.Controllers
{
    [ApiController]
    [Route("/pustakalaya/carts")]
    public class CartController : Controller
    {
        private ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpPost("/add-to-cart")]
        public IActionResult AddToCart([FromBody] CartDTO cart) 
        { 
            _cartService.AddToCart(cart);
            return Ok("Add to Cart");
        }

        [HttpGet("/get-Cart-details")]
        public IActionResult GetCartByUserId([FromQuery] Guid UserId)
        {
            CartResponseDTO cart = _cartService.getCartByUserId(UserId);
            return Ok(cart);
        }

        [HttpPatch("/increase-item")]
        public IActionResult IncreaseItem([FromBody] CartItemQuantity cartItemQuantity)
        {
            _cartService.IncreateItemQuantity(cartItemQuantity);
            return Ok("Item Increased");
        }

        [HttpPatch("/decrease-item")]
        public IActionResult DecreaseItem([FromBody] CartItemQuantity cartItemQuantity)
        {
            _cartService.DecreaseItemQuantity(cartItemQuantity);
            return Ok("Item Increased");
        }

        [HttpDelete("/delete-item")]
        public IActionResult DeleteItemFromCart([FromBody] CartItemQuantity cartItemQuantity)
        {
            _cartService.deleteItem(cartItemQuantity);
            return Ok("Item Removed From Cart");
        }
    }
}
