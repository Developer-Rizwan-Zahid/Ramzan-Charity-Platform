using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Role { get; set; } = "Donor"; 

        public string? Cnic { get; set; }
        public bool IsCnicVerified { get; set; } = false;
        public bool IsBlocked { get; set; } = false;
        public string? Phone { get; set; }
        public string? Address { get; set; }

        public bool IsEmailVerified { get; set; } = false;

        public string? OtpCode { get; set; }
        public DateTime? OtpExpiry { get; set; }

        public string? ResetToken { get; set; }
        public DateTime? ResetTokenExpiry { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
