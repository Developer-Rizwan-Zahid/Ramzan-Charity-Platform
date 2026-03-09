using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public enum DonationStatus
    {
        Pending,
        Completed,
        Failed
    }

    public class Donation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int DonorId { get; set; }

        [ForeignKey("DonorId")]
        public User? Donor { get; set; }

        public int? HelpRequestId { get; set; }

        [ForeignKey("HelpRequestId")]
        public HelpRequest? HelpRequest { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(10)]
        public string Currency { get; set; } = "PKR";

        [Required]
        public DonationStatus Status { get; set; } = DonationStatus.Pending;

        [MaxLength(50)]
        public string? PaymentMethod { get; set; } = "Stripe";

        [MaxLength(100)]
        public string? TransactionId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
