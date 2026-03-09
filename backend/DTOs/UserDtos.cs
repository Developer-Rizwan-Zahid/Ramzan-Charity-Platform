using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? Cnic { get; set; }
        public bool IsCnicVerified { get; set; }
        public bool IsBlocked { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public bool IsEmailVerified { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class UpdateProfileDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Cnic { get; set; }
    }
}
