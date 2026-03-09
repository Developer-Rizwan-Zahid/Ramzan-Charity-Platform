using backend.DTOs;
using backend.Models;

namespace backend.Services
{
    public interface IAdminService
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync();
        Task<List<DonationReportDto>> GetDonationReportAsync();
        Task<List<FraudAlertDto>> GetFraudAlertsAsync();
        Task<List<Donation>> GetTransactionLogsAsync();
    }
}
