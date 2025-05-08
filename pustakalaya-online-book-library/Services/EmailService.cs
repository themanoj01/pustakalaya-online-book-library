using Microsoft.Extensions.Options;
using pustakalaya_online_book_library.DTOs;
using System.Net.Mail;
using System.Net;
using pustakalaya_online_book_library.Services.Interfaces;

namespace pustakalaya_online_book_library.Services
{
    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _smtpSettings;

        public EmailService(IOptions<SmtpSettings> smtpSettings)
        {
            _smtpSettings = smtpSettings.Value;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var mailMessage = new MailMessage
            {
                From = new MailAddress(_smtpSettings.UserName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mailMessage.To.Add(toEmail);

            using (var client = new SmtpClient(_smtpSettings.Host, _smtpSettings.Port))
            {
                client.EnableSsl = _smtpSettings.EnableSsl;
                client.Credentials = new NetworkCredential(_smtpSettings.UserName, _smtpSettings.Password);
                await client.SendMailAsync(mailMessage);
            }
        }
    }
}
