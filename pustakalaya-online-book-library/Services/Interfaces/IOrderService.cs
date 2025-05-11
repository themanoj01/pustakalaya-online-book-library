using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;

namespace pustakalaya_online_book_library.Services.Interfaces
{
    public interface IOrderService
    {
        OrderDTO AddOrder(OrderCreateDTO orderCreateDTO);
        void cancleOrder(Guid orderId);
        void changeOrderStatus(Guid orderId);
        List<OrderDTO> getAllOrders();
        List<OrderDTO> getOrderByOrderId(Guid orderId);
        List<OrderDTO> getOrderByUser(Guid userId);
    }
}
