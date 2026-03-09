using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [AllowAnonymous]
    [Route("api/webhooks")]
    [ApiController]
    public class WebhookController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public WebhookController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("stripe")]
        public IActionResult StripeWebhook([FromHeader(Name = "X-Stripe-Signature")] string signature)
        {
            var secret = _configuration["Webhooks:StripeSecret"];
            if (string.IsNullOrEmpty(secret) || signature != secret)
            {
                return Unauthorized(new { message = "Invalid secret key verification." });
            }

            return Ok(new { status = "success", message = "Stripe webhook received and verified." });
        }

        [HttpPost("jazzcash")]
        public IActionResult JazzCashWebhook([FromHeader(Name = "X-JazzCash-Secret")] string secretHeader)
        {
            var secret = _configuration["Webhooks:JazzCashSecret"];
            if (string.IsNullOrEmpty(secret) || secretHeader != secret)
            {
                return Unauthorized(new { message = "Invalid secret key verification." });
            }

            return Ok(new { status = "success", message = "JazzCash webhook received and verified." });
        }

        [HttpPost("easypaisa")]
        public IActionResult EasypaisaWebhook([FromHeader(Name = "X-Easypaisa-Secret")] string secretHeader)
        {
            var secret = _configuration["Webhooks:EasypaisaSecret"];
            if (string.IsNullOrEmpty(secret) || secretHeader != secret)
            {
                return Unauthorized(new { message = "Invalid secret key verification." });
            }

            return Ok(new { status = "success", message = "Easypaisa webhook received and verified." });
        }
    }
}
