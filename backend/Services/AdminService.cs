using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _context;

        public AdminService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalDonors = await _context.Users.CountAsync(u => u.Role == "Donor");
            var totalNeedy = await _context.Users.CountAsync(u => u.Role == "Needy");
            var totalDonations = await _context.Donations
                .Where(d => d.Status == DonationStatus.Completed)
                .SumAsync(d => d.Amount);
            var activeHelpRequests = await _context.HelpRequests.CountAsync(h => h.Status == HelpRequestStatus.Approved);

            return new DashboardStatsDto
            {
                TotalUsers = totalUsers,
                TotalDonors = totalDonors,
                TotalNeedy = totalNeedy,
                TotalDonations = totalDonations,
                ActiveHelpRequests = activeHelpRequests
            };
        }

        public async Task<List<DonationReportDto>> GetDonationReportAsync()
        {
            return await _context.Donations
                .Where(d => d.Status == DonationStatus.Completed)
                .GroupBy(d => new { d.CreatedAt.Year, d.CreatedAt.Month })
                .Select(g => new DonationReportDto
                {
                    Month = $"{g.Key.Year}-{g.Key.Month:D2}",
                    TotalAmount = g.Sum(d => d.Amount),
                    DonationCount = g.Count()
                })
                .OrderByDescending(r => r.Month)
                .ToListAsync();
        }

        public async Task<List<FraudAlertDto>> GetFraudAlertsAsync()
        {
           
            var threshold = 10000m;
            var since = DateTime.UtcNow.AddDays(-1);

            var suspiciousUsers = await _context.Donations
                .Where(d => d.CreatedAt >= since && d.Amount >= threshold)
                .GroupBy(d => d.DonorId)
                .Where(g => g.Count() > 3)
                .Select(g => g.Key)
                .ToListAsync();

            var alerts = new List<FraudAlertDto>();
            foreach (var userId in suspiciousUsers)
            {
                var user = await _context.Users.FindAsync(userId);
                if (user != null)
                {
                    alerts.Add(new FraudAlertDto
                    {
                        UserId = user.Id,
                        UserName = user.Name,
                        Reason = "Multiple large donations detected within 24 hours.",
                        DetectedAt = DateTime.UtcNow
                    });
                }
            }

            return alerts;
        }

        public async Task<List<Donation>> GetTransactionLogsAsync()
        {
            return await _context.Donations
                .Include(d => d.Donor)
                .Include(d => d.HelpRequest)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();
        }
    }
}
