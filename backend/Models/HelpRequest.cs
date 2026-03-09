using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public enum HelpRequestStatus
    {
        Pending,
        Approved,
        Rejected,
        Completed
    }

    public class HelpRequest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal AmountRequested { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal AmountCollected { get; set; } = 0;

        [Required]
        public HelpRequestStatus Status { get; set; } = HelpRequestStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
