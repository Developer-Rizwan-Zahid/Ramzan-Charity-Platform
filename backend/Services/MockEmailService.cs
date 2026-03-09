using Microsoft.Extensions.Logging;
using backend.Models;

namespace backend.Services
{
    public class MockEmailService : IEmailService
    {
        private readonly ILogger<MockEmailService> _logger;

        public MockEmailService(ILogger<MockEmailService> logger)
        {
            _logger = logger;
        }

        public Task SendEmailAsync(string toEmail, string subject, string body)
        {
            _logger.LogInformation($"[MOCK EMAIL] Sending to: {toEmail}");
            _logger.LogInformation($"[MOCK EMAIL] Subject: {subject}");
            _logger.LogInformation($"[MOCK EMAIL] Body: {body}");
            return Task.CompletedTask;
        }
    }
}
