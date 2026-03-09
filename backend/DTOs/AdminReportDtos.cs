namespace backend.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalUsers { get; set; }
        public int TotalDonors { get; set; }
        public int TotalNeedy { get; set; }
        public decimal TotalDonations { get; set; }
        public int ActiveHelpRequests { get; set; }
    }

    public class DonationReportDto
    {
        public string Month { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public int DonationCount { get; set; }
    }

    public class FraudAlertDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public DateTime DetectedAt { get; set; }
    }
}
