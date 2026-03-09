using backend.DTOs;
using backend.Models;

namespace backend.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        Task<AuthResponseDto> VerifyOtpAsync(VerifyOtpDto dto);
        Task<AuthResponseDto> ResendOtpAsync(ResendOtpDto dto);
        Task<AuthResponseDto> ForgotPasswordAsync(ForgotPasswordDto dto);
        Task<AuthResponseDto> ResetPasswordAsync(ResetPasswordDto dto);
        Task<User?> GetUserByIdAsync(int userId);
    }
}
