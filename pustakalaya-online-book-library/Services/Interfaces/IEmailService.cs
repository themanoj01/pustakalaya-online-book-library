using pustakalaya_online_book_library.Entities;

namespace pustakalaya_online_book_library.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body, Dictionary<string, byte[]> attachments = null);
        byte[] GenerateInvoicePdf(Orders order, List<(string Title, int Quantity, decimal Price)> items);
    }
}
