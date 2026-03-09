using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class HelpRequestService : IHelpRequestService
    {
        private readonly AppDbContext _context;

        public HelpRequestService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<AuthResponseDto> CreateRequestAsync(int userId, CreateHelpRequestDto dto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return new AuthResponseDto { Success = false, Message = "User not found" };

            var request = new HelpRequest
            {
                UserId = userId,
                Title = dto.Title,
                Description = dto.Description,
                AmountRequested = dto.AmountRequested,
                Status = HelpRequestStatus.Pending
            };

            _context.HelpRequests.Add(request);
            await _context.SaveChangesAsync();

            return new AuthResponseDto { Success = true, Message = "Help request submitted successfully" };
        }

        public async Task<IEnumerable<HelpRequestResponseDto>> GetMyRequestsAsync(int userId)
        {
            return await _context.HelpRequests
                .Where(r => r.UserId == userId)
                .Include(r => r.User)
                .Select(r => MapToResponseDto(r))
                .ToListAsync();
        }

        public async Task<IEnumerable<HelpRequestResponseDto>> GetAllApprovedRequestsAsync()
        {
            return await _context.HelpRequests
                .Where(r => r.Status == HelpRequestStatus.Approved)
                .Include(r => r.User)
                .Select(r => MapToResponseDto(r))
                .ToListAsync();
        }

        public async Task<IEnumerable<HelpRequestResponseDto>> GetAllRequestsAdminAsync()
        {
            return await _context.HelpRequests
                .Include(r => r.User)
                .Select(r => MapToResponseDto(r))
                .ToListAsync();
        }

        public async Task<HelpRequestResponseDto?> GetRequestByIdAsync(int id)
        {
            var request = await _context.HelpRequests
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == id);
            
            return request == null ? null : MapToResponseDto(request);
        }

        public async Task<AuthResponseDto> ApproveRequestAsync(int id)
        {
            var request = await _context.HelpRequests.FindAsync(id);
            if (request == null) return new AuthResponseDto { Success = false, Message = "Request not found" };

            request.Status = HelpRequestStatus.Approved;
            await _context.SaveChangesAsync();

            return new AuthResponseDto { Success = true, Message = "Request approved successfully" };
        }

        public async Task<AuthResponseDto> RejectRequestAsync(int id)
        {
            var request = await _context.HelpRequests.FindAsync(id);
            if (request == null) return new AuthResponseDto { Success = false, Message = "Request not found" };

            request.Status = HelpRequestStatus.Rejected;
            await _context.SaveChangesAsync();

            return new AuthResponseDto { Success = true, Message = "Request rejected successfully" };
        }

        public async Task<AuthResponseDto> DeleteRequestAsync(int id)
        {
            var request = await _context.HelpRequests.FindAsync(id);
            if (request == null) return new AuthResponseDto { Success = false, Message = "Request not found" };

            _context.HelpRequests.Remove(request);
            await _context.SaveChangesAsync();

            return new AuthResponseDto { Success = true, Message = "Request removed successfully" };
        }

        private static HelpRequestResponseDto MapToResponseDto(HelpRequest request)
        {
            return new HelpRequestResponseDto
            {
                Id = request.Id,
                UserId = request.UserId,
                UserName = request.User?.Name ?? "Unknown",
                Title = request.Title,
                Description = request.Description,
                AmountRequested = request.AmountRequested,
                AmountCollected = request.AmountCollected,
                Status = request.Status.ToString(),
                CreatedAt = request.CreatedAt
            };
        }
    }
}
