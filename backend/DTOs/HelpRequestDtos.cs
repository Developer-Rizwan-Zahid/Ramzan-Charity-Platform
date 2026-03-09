using System.ComponentModel.DataAnnotations;
using backend.Models;

namespace backend.DTOs
{
    public class CreateHelpRequestDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(1, double.MaxValue, ErrorMessage = "Amount requested must be greater than 0")]
        public decimal AmountRequested { get; set; }
    }

    public class HelpRequestResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal AmountRequested { get; set; }
        public decimal AmountCollected { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
