using backend.DTOs;

namespace backend.Services
{
    public interface IHelpRequestService
    {
        Task<AuthResponseDto> CreateRequestAsync(int userId, CreateHelpRequestDto dto);
        Task<IEnumerable<HelpRequestResponseDto>> GetMyRequestsAsync(int userId);
        Task<IEnumerable<HelpRequestResponseDto>> GetAllApprovedRequestsAsync();
        Task<IEnumerable<HelpRequestResponseDto>> GetAllRequestsAdminAsync();
        Task<HelpRequestResponseDto?> GetRequestByIdAsync(int id);
        Task<AuthResponseDto> ApproveRequestAsync(int id);
        Task<AuthResponseDto> RejectRequestAsync(int id);
        Task<AuthResponseDto> DeleteRequestAsync(int id);
    }
}
