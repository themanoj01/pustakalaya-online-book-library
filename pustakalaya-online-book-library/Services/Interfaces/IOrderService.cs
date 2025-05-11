using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;

namespace pustakalaya_online_book_library.Services.Interfaces
{
    public interface IOrderService
    {
        void AddOrder(OrderCreateDTO orderCreateDTO);
        void cancleOrder(Guid orderId);
        void changeOrderStatus(Guid orderId);
        List<OrderDTO> getAllOrders();
        List<OrderDTO> getOrderByUser(Guid userId);
    }
}
