using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace backend.Services
{
    public class SmtpEmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<SmtpEmailService> _logger;

        public SmtpEmailService(IConfiguration config, ILogger<SmtpEmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                var smtpHost = _config["EmailSettings:Host"];
                var smtpPort = int.Parse(_config["EmailSettings:Port"] ?? "587");
                var smtpUser = _config["EmailSettings:Username"];
                var smtpPass = _config["EmailSettings:Password"];
                var fromEmail = _config["EmailSettings:FromEmail"];

                if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpUser))
                {
                    _logger.LogWarning("Email settings are not fully configured. Falling back to console log.");
                    _logger.LogInformation($"[MOCK EMAIL] To: {toEmail}, Subject: {subject}, Body: {body}");
                    return;
                }

                using var client = new SmtpClient(smtpHost, smtpPort)
                {
                    Credentials = new NetworkCredential(smtpUser, smtpPass),
                    EnableSsl = true
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(fromEmail ?? smtpUser),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(toEmail);

                await client.SendMailAsync(mailMessage);
                _logger.LogInformation($"Email sent successfully to {toEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to send email to {toEmail}: {ex.Message}");
                // In dev mode, we still log the OTP so the user isn't blocked
                _logger.LogInformation($"[EMERGENCY LOG] OTP for {toEmail} was: {body}");
            }
        }
    }
}
