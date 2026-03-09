using backend.DTOs;

namespace backend.Services
{
    public interface IDonationService
    {
        Task<string> CreateCheckoutSessionAsync(int donorId, CreateDonationRequest request);
        Task<bool> VerifyPaymentAsync(string transactionId);
        Task<IEnumerable<DonationResponse>> GetDonorHistoryAsync(int donorId);
        Task<IEnumerable<DonationResponse>> GetCaseDonationsAsync(int helpRequestId);
        Task<IEnumerable<DonationResponse>> GetAllDonationsAsync();
    }
}
