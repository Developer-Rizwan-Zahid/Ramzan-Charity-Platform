using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CreateDonationRequest
    {
        [Required]
        public decimal Amount { get; set; }

        public int? HelpRequestId { get; set; }

        [Required]
        public string PaymentMethod { get; set; } = "Stripe";
    }

    public class DonationResponse
    {
        public int Id { get; set; }
        public int DonorId { get; set; }
        public string DonorName { get; set; } = string.Empty;
        public int? HelpRequestId { get; set; }
        public string? HelpRequestTitle { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "PKR";
        public string Status { get; set; } = string.Empty;
        public string? PaymentMethod { get; set; }
        public string? TransactionId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
