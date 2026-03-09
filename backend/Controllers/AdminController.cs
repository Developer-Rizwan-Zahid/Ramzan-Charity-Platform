using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var stats = await _adminService.GetDashboardStatsAsync();
            return Ok(stats);
        }

        [HttpGet("donation-report")]
        public async Task<IActionResult> GetDonationReport()
        {
            var report = await _adminService.GetDonationReportAsync();
            return Ok(report);
        }

        [HttpGet("fraud-alerts")]
        public async Task<IActionResult> GetFraudAlerts()
        {
            var alerts = await _adminService.GetFraudAlertsAsync();
            return Ok(alerts);
        }

        [HttpGet("transaction-logs")]
        public async Task<IActionResult> GetTransactionLogs()
        {
            var logs = await _adminService.GetTransactionLogsAsync();
            return Ok(logs);
        }
    }
}
