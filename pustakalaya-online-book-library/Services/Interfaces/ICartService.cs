using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;

namespace pustakalaya_online_book_library.Services.Interfaces
{
    public interface ICartService
    {
        void AddToCart(CartDTO cart);
        CartResponseDTO getCartByUserId(Guid userId);
        void IncreateItemQuantity(CartItemQuantity cartItemQuantity);
        void DecreaseItemQuantity(CartItemQuantity cartItemQuantity);
        void deleteItem(CartItemQuantity cartItemQuantity);
    }
}
