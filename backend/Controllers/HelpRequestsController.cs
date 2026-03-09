using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HelpRequestsController : ControllerBase
    {
        private readonly IHelpRequestService _helpRequestService;

        public HelpRequestsController(IHelpRequestService helpRequestService)
        {
            _helpRequestService = helpRequestService;
        }

        [HttpPost]
        [Authorize(Roles = "Needy")]
        public async Task<IActionResult> CreateRequest([FromBody] CreateHelpRequestDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);
            var result = await _helpRequestService.CreateRequestAsync(userId, dto);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("my")]
        [Authorize(Roles = "Needy")]
        public async Task<ActionResult<IEnumerable<HelpRequestResponseDto>>> GetMyRequests()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);
            var requests = await _helpRequestService.GetMyRequestsAsync(userId);
            return Ok(requests);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HelpRequestResponseDto>>> GetAllApprovedRequests()
        {
            var requests = await _helpRequestService.GetAllApprovedRequestsAsync();
            return Ok(requests);
        }

        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<HelpRequestResponseDto>>> GetAllRequestsAdmin()
        {
            var requests = await _helpRequestService.GetAllRequestsAdminAsync();
            return Ok(requests);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HelpRequestResponseDto>> GetRequest(int id)
        {
            var request = await _helpRequestService.GetRequestByIdAsync(id);
            if (request == null) return NotFound(new { message = "Request not found" });
            return Ok(request);
        }

        [HttpPut("approve/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveRequest(int id)
        {
            var result = await _helpRequestService.ApproveRequestAsync(id);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpPut("reject/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RejectRequest(int id)
        {
            var result = await _helpRequestService.RejectRequestAsync(id);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteRequest(int id)
        {
            var result = await _helpRequestService.DeleteRequestAsync(id);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }
    }
}
