using backend.DTOs;

namespace backend.Services
{
    public interface IPayoutService
    {
        Task<PayoutResponse> RequestPayoutAsync(int needyId, PayoutRequest request);
        Task<IEnumerable<PayoutResponse>> GetPendingPayoutsAsync();
        Task<bool> ApprovePayoutAsync(int payoutId, string adminNotes);
        Task<bool> RejectPayoutAsync(int payoutId, string adminNotes);
        Task<bool> ProcessPayoutAsync(int payoutId);
        Task<IEnumerable<PayoutResponse>> GetMyPayoutsAsync(int needyId);
    }
}
