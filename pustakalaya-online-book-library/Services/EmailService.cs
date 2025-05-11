using Microsoft.Extensions.Options;
using pustakalaya_online_book_library.DTOs;
using System.Net.Mail;
using System.Net;
using pustakalaya_online_book_library.Services.Interfaces;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;
using pustakalaya_online_book_library.Entities;

namespace pustakalaya_online_book_library.Services
{
    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _smtpSettings;

        public EmailService(IOptions<SmtpSettings> smtpSettings)
        {
            _smtpSettings = smtpSettings.Value;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body, Dictionary<string, byte[]> attachments = null)
        {
            var mailMessage = new MailMessage
            {
                From = new MailAddress(_smtpSettings.UserName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mailMessage.To.Add(toEmail);
            if (attachments != null)
            {
                foreach (var attachment in attachments)
                {
                    var memoryStream = new MemoryStream(attachment.Value);
                    mailMessage.Attachments.Add(new Attachment(memoryStream, attachment.Key, "application/pdf"));
                }
            }

            using (var client = new SmtpClient(_smtpSettings.Host, _smtpSettings.Port))
            {
                client.EnableSsl = _smtpSettings.EnableSsl;
                client.Credentials = new NetworkCredential(_smtpSettings.UserName, _smtpSettings.Password);
                await client.SendMailAsync(mailMessage);
            }
        }

        public byte[] GenerateInvoicePdf(Orders order, List<(string Title, int Quantity, decimal Price)> items)
        {
            using var stream = new MemoryStream();
            var document = new PdfDocument();
            var page = document.AddPage();
            var gfx = XGraphics.FromPdfPage(page);

            var fontRegular = new XFont("Arial", 12, XFontStyle.Regular);
            var fontBold = new XFont("Arial", 14, XFontStyle.Bold);
            var fontHeader = new XFont("Arial", 18, XFontStyle.BoldItalic);
            double y = 40;

            // Header
            gfx.DrawString("PUSTAKALAYA INVOICE", fontHeader, XBrushes.DarkSlateBlue, new XRect(0, y, page.Width, 30), XStringFormats.TopCenter);
            y += 40;

            // Order Info
            gfx.DrawString("Order Summary", fontBold, XBrushes.Black, 40, y); y += 25;
            gfx.DrawString($"Order ID: {order.OrderId}", fontRegular, XBrushes.Black, 40, y); y += 20;
            gfx.DrawString($"Claim Code: {order.ClaimCode}", fontRegular, XBrushes.Black, 40, y); y += 20;
            gfx.DrawString($"Order Date: {order.OrderDate:dd MMM yyyy hh:mm tt}", fontRegular, XBrushes.Black, 40, y); y += 30;

            // Table Header
            gfx.DrawString("Book Title", fontBold, XBrushes.Black, 40, y);
            gfx.DrawString("Quantity", fontBold, XBrushes.Black, 300, y);
            gfx.DrawString("Price", fontBold, XBrushes.Black, 400, y);
            y += 20;

            gfx.DrawLine(XPens.Black, 40, y, page.Width - 40, y); y += 10;

            decimal grandTotal = 0;

            foreach (var item in items)
            {
                gfx.DrawString(item.Title, fontRegular, XBrushes.Black, 40, y);
                gfx.DrawString(item.Quantity.ToString(), fontRegular, XBrushes.Black, 300, y);
                gfx.DrawString($"Rs. {item.Price * item.Quantity:F2}", fontRegular, XBrushes.Black, 400, y);
                y += 20;

                grandTotal += item.Price * item.Quantity;
            }

            y += 10;
            gfx.DrawLine(XPens.Black, 40, y, page.Width - 40, y); y += 20;

            // Total
            gfx.DrawString($"Total Amount: Rs. {grandTotal:F2}", fontBold, XBrushes.DarkGreen, 40, y); y += 30;

            // Footer
            gfx.DrawString("Thank you for shopping with Pustakalaya! 📖", fontRegular, XBrushes.Gray, new XRect(0, y, page.Width, page.Height - y), XStringFormats.TopCenter);

            document.Save(stream, false);
            return stream.ToArray();
        }

    }
}
