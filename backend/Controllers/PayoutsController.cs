using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/payouts")]
    [ApiController]
    [Authorize]
    public class PayoutsController : ControllerBase
    {
        private readonly IPayoutService _payoutService;

        public PayoutsController(IPayoutService payoutService)
        {
            _payoutService = payoutService;
        }

        [HttpPost("request")]
        [Authorize(Roles = "Needy")]
        public async Task<IActionResult> RequestPayout(PayoutRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _payoutService.RequestPayoutAsync(userId, request);
            return Ok(result);
        }

        [HttpGet("pending")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPendingPayouts()
        {
            var payouts = await _payoutService.GetPendingPayoutsAsync();
            return Ok(payouts);
        }

        [HttpPut("approve/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApprovePayout(int id, [FromBody] string adminNotes)
        {
            var success = await _payoutService.ApprovePayoutAsync(id, adminNotes);
            if (!success) return NotFound(new { message = "Payout request not found" });
            return Ok(new { message = "Payout approved" });
        }

        [HttpPut("reject/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RejectPayout(int id, [FromBody] string adminNotes)
        {
            var success = await _payoutService.RejectPayoutAsync(id, adminNotes);
            if (!success) return NotFound(new { message = "Payout request not found" });
            return Ok(new { message = "Payout rejected" });
        }

        [HttpPost("process/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ProcessPayout(int id)
        {
            var success = await _payoutService.ProcessPayoutAsync(id);
            if (!success) return BadRequest(new { message = "Payout cannot be processed (must be approved first)" });
            return Ok(new { message = "Payout marked as processed" });
        }

        [HttpGet("my")]
        [Authorize(Roles = "Needy")]
        public async Task<IActionResult> GetMyPayouts()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var payouts = await _payoutService.GetMyPayoutsAsync(userId);
            return Ok(payouts);
        }
    }
}
