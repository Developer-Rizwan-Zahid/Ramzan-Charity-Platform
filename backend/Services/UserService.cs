using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
        {
            return await _context.Users
                .Select(u => MapToResponseDto(u))
                .ToListAsync();
        }

        public async Task<UserResponseDto?> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            return user == null ? null : MapToResponseDto(user);
        }

        public async Task<AuthResponseDto> VerifyCnicAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return new AuthResponseDto { Success = false, Message = "User not found" };

            user.IsCnicVerified = true;
            await _context.SaveChangesAsync();

            return new AuthResponseDto { Success = true, Message = "CNIC verified successfully" };
        }

        public async Task<AuthResponseDto> BlockUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return new AuthResponseDto { Success = false, Message = "User not found" };

            user.IsBlocked = !user.IsBlocked;
            await _context.SaveChangesAsync();

            string status = user.IsBlocked ? "blocked" : "unblocked";
            return new AuthResponseDto { Success = true, Message = $"User {status} successfully" };
        }

        public async Task<AuthResponseDto> UpdateProfileAsync(int userId, UpdateProfileDto dto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return new AuthResponseDto { Success = false, Message = "User not found" };

            user.Name = dto.Name;
            user.Phone = dto.Phone;
            user.Address = dto.Address;
            user.Cnic = dto.Cnic;

            await _context.SaveChangesAsync();

            return new AuthResponseDto { Success = true, Message = "Profile updated successfully" };
        }

        public async Task<AuthResponseDto> DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return new AuthResponseDto { Success = false, Message = "User not found" };

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return new AuthResponseDto { Success = true, Message = "User deleted successfully" };
        }

        private static UserResponseDto MapToResponseDto(User user)
        {
            return new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                Cnic = user.Cnic,
                IsCnicVerified = user.IsCnicVerified,
                IsBlocked = user.IsBlocked,
                Phone = user.Phone,
                Address = user.Address,
                IsEmailVerified = user.IsEmailVerified,
                CreatedAt = user.CreatedAt
            };
        }
    }
}
