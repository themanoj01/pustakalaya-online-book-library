using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;
using pustakalaya_online_book_library.Services.Interfaces;

namespace pustakalaya_online_book_library.Controllers
{
    [ApiController]
    [Route("pustakalaya/orders")]
    public class OrderController : Controller
    {
        public IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("add-order")]
        public IActionResult AddOrder([FromBody] OrderCreateDTO orderCreateDTO)
        {
            OrderDTO order = _orderService.AddOrder(orderCreateDTO);
            return Ok(order);
        }

        [HttpGet("get-orders")]
        public IActionResult GetOrders()
        {
            List<OrderDTO> orderList = _orderService.getAllOrders();
            return Ok(orderList);
        }

        [HttpGet("get-order/{orderId}")]
        public IActionResult GetOrderByOrderId(Guid orderId)
        {
            List<OrderDTO> orderList = _orderService.getOrderByOrderId(orderId);
            return Ok(orderList);
        }

        [HttpGet("get-order-by-user")]
        public IActionResult GetOrderByUserId([FromQuery] Guid userId)
        {
            List<OrderDTO> orderList = _orderService.getOrderByUser(userId);
            return Ok(orderList);
        }

        [HttpPatch("change-status")]
        public IActionResult ChangeOrderStatus([FromQuery] Guid orderId)
        {
            _orderService.changeOrderStatus(orderId);
            return Ok("Order Delivered Successfully");
        }

        [HttpDelete("cancel-order")]
        public IActionResult CancleOrder([FromQuery] Guid orderId) 
        {
            _orderService.cancleOrder(orderId);
            return Ok("Order Cancelled successfully.");
        }

        [HttpGet("latest-orders")]
        public IActionResult GetLatestOrders()
        {
            var orders = _orderService.getAllOrders()
                .OrderByDescending(o => o.OrderDate)
                .Take(10)
                .ToList();
            return Ok(orders);
        }

    }
}
