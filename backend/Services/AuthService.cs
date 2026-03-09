using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;

        public AuthService(AppDbContext context, IConfiguration config, IEmailService emailService)
        {
            _context = context;
            _config = config;
            _emailService = emailService;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return new AuthResponseDto { Success = false, Message = "Email already exists" };
            }

            var otp = new Random().Next(100000, 999999).ToString();
            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Role = dto.Role,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                OtpCode = otp,
                OtpExpiry = DateTime.UtcNow.AddMinutes(15),
                IsEmailVerified = false
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            await _emailService.SendEmailAsync(user.Email, "Verify Your Account", $"Your OTP is {otp}");

            return new AuthResponseDto { Success = true, Message = "User registered successfully. Please verify your OTP." };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return new AuthResponseDto { Success = false, Message = "Invalid credentials" };
            }

            if (!user.IsEmailVerified)
            {
                return new AuthResponseDto { Success = false, Message = "Please verify your email address first. You can resend the OTP." };
            }

            var token = GenerateJwtToken(user);
            return new AuthResponseDto
            {
                Success = true,
                Message = "Login successful",
                Token = token,
                User = new { user.Id, user.Name, user.Email, user.Role }
            };
        }

        public async Task<AuthResponseDto> VerifyOtpAsync(VerifyOtpDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
            {
                return new AuthResponseDto { Success = false, Message = "User not found" };
            }

            if (user.OtpCode != dto.OtpCode || user.OtpExpiry < DateTime.UtcNow)
            {
                return new AuthResponseDto { Success = false, Message = "Invalid or expired OTP" };
            }

            user.IsEmailVerified = true;
            user.OtpCode = null;
            user.OtpExpiry = null;
            await _context.SaveChangesAsync();

            return new AuthResponseDto { Success = true, Message = "Email verified successfully. You can now login." };
        }

        public async Task<AuthResponseDto> ResendOtpAsync(ResendOtpDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null) return new AuthResponseDto { Success = false, Message = "User not found" };
            
            if (user.IsEmailVerified) return new AuthResponseDto { Success = false, Message = "User is already verified" };

            var otp = new Random().Next(100000, 999999).ToString();
            user.OtpCode = otp;
            user.OtpExpiry = DateTime.UtcNow.AddMinutes(15);
            await _context.SaveChangesAsync();

            await _emailService.SendEmailAsync(user.Email, "Verify Your Account", $"Your new OTP is {otp}");

            return new AuthResponseDto { Success = true, Message = "A new OTP has been sent to your email." };
        }

        public async Task<AuthResponseDto> ForgotPasswordAsync(ForgotPasswordDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
            {
           
                return new AuthResponseDto { Success = true, Message = "If that email is registered, a reset link/OTP has been sent." };
            }

            var resetToken = Guid.NewGuid().ToString("N");
            user.ResetToken = resetToken;
            user.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(30);
            await _context.SaveChangesAsync();

            await _emailService.SendEmailAsync(user.Email, "Reset Password", $"Your reset token is: {resetToken}");

            return new AuthResponseDto { Success = true, Message = "If that email is registered, a reset link/OTP has been sent." };
        }

        public async Task<AuthResponseDto> ResetPasswordAsync(ResetPasswordDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ResetToken == dto.ResetToken);
            if (user == null || user.ResetTokenExpiry < DateTime.UtcNow)
            {
                return new AuthResponseDto { Success = false, Message = "Invalid or expired reset token" };
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.ResetToken = null;
            user.ResetTokenExpiry = null;
            await _context.SaveChangesAsync();

            return new AuthResponseDto { Success = true, Message = "Password has been reset successfully. You can now login." };
        }

        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _context.Users.FindAsync(userId);
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]!);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("Name", user.Name)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(_config["Jwt:ExpireMinutes"]!)),
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
