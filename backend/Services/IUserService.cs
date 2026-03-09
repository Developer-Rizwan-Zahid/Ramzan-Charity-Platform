using backend.DTOs;

namespace backend.Services
{
    public interface IUserService
    {
        Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
        Task<UserResponseDto?> GetUserByIdAsync(int id);
        Task<AuthResponseDto> VerifyCnicAsync(int id);
        Task<AuthResponseDto> BlockUserAsync(int id);
        Task<AuthResponseDto> UpdateProfileAsync(int userId, UpdateProfileDto dto);
        Task<AuthResponseDto> DeleteUserAsync(int id);
    }
}
