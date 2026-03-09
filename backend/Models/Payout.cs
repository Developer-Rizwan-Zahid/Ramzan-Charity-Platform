using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public enum PayoutStatus
    {
        Pending,
        Approved,
        Rejected,
        Processed
    }

    public class Payout
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int NeedyId { get; set; }

        [ForeignKey("NeedyId")]
        public User? Needy { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        public PayoutStatus Status { get; set; } = PayoutStatus.Pending;

        public DateTime RequestDate { get; set; } = DateTime.UtcNow;

        public DateTime? ProcessedDate { get; set; }

        public string? AdminNotes { get; set; }
    }
}
