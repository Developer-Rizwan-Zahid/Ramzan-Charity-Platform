using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/donations")]
    [ApiController]
    [Authorize]
    public class DonationsController : ControllerBase
    {
        private readonly IDonationService _donationService;

        public DonationsController(IDonationService donationService)
        {
            _donationService = donationService;
        }

        [HttpPost("create-checkout")]
        public async Task<IActionResult> CreateCheckout(CreateDonationRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var checkoutUrl = await _donationService.CreateCheckoutSessionAsync(userId, request);
            return Ok(new { url = checkoutUrl });
        }

        [HttpPost("verify-payment")]
        public async Task<IActionResult> VerifyPayment([FromBody] string transactionId)
        {
            var success = await _donationService.VerifyPaymentAsync(transactionId);
            if (!success) return BadRequest(new { message = "Payment verification failed" });
            return Ok(new { message = "Payment verified successfully" });
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyDonations()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var history = await _donationService.GetDonorHistoryAsync(userId);
            return Ok(history);
        }

        [HttpGet("case/{helpRequestId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCaseDonations(int helpRequestId)
        {
            var donations = await _donationService.GetCaseDonationsAsync(helpRequestId);
            return Ok(donations);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllDonations()
        {
            var donations = await _donationService.GetAllDonationsAsync();
            return Ok(donations);
        }
    }
}
