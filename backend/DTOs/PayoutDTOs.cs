using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class PayoutRequest
    {
        [Required]
        public decimal Amount { get; set; }
    }

    public class PayoutResponse
    {
        public int Id { get; set; }
        public int NeedyId { get; set; }
        public string NeedyName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime RequestDate { get; set; }
        public DateTime? ProcessedDate { get; set; }
        public string? AdminNotes { get; set; }
    }
}
