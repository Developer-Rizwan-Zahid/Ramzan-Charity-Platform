using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Stripe.Checkout;
using Microsoft.Extensions.Configuration;

namespace backend.Services
{
    public class DonationService : IDonationService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public DonationService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<string> CreateCheckoutSessionAsync(int donorId, CreateDonationRequest request)
        {
            var donation = new Donation
            {
                DonorId = donorId,
                HelpRequestId = request.HelpRequestId,
                Amount = request.Amount,
                Status = DonationStatus.Pending,
                PaymentMethod = request.PaymentMethod,
                TransactionId = Guid.NewGuid().ToString() 
            };

            _context.Donations.Add(donation);
            await _context.SaveChangesAsync();

            // Check if we should use Mock mode
            if (_configuration.GetValue<bool>("Testing:UseMockStripe"))
            {
                // Return a direct success URL to the frontend
                return $"http://localhost:3000/donation/success?session_id=mock_session_{donation.TransactionId}&transaction_id={donation.TransactionId}";
            }

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = (long)(request.Amount * 100), // Amount in cents
                            Currency = "pkr",
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = request.HelpRequestId.HasValue ? "Help Request Donation" : "General Donation",
                                Description = $"Donation for Case #{request.HelpRequestId}"
                            },
                        },
                        Quantity = 1,
                    },
                },
                Mode = "payment",
                SuccessUrl = $"http://localhost:3000/donation/success?session_id={{CHECKOUT_SESSION_ID}}&transaction_id={donation.TransactionId}",
                CancelUrl = "http://localhost:3000/cases",
                Metadata = new Dictionary<string, string>
                {
                    { "TransactionId", donation.TransactionId }
                }
            };

            var service = new SessionService();
            Session session = await service.CreateAsync(options);

            return session.Url;
        }

        public async Task<bool> VerifyPaymentAsync(string transactionId)
        {
            var donation = await _context.Donations.FirstOrDefaultAsync(d => d.TransactionId == transactionId);
            if (donation == null) return false;

            donation.Status = DonationStatus.Completed;
            
            if (donation.HelpRequestId.HasValue)
            {
                var helpRequest = await _context.HelpRequests.FindAsync(donation.HelpRequestId.Value);
                if (helpRequest != null)
                {
                    helpRequest.AmountCollected += donation.Amount;
                    if (helpRequest.AmountCollected >= helpRequest.AmountRequested)
                    {
                        helpRequest.Status = HelpRequestStatus.Completed;
                    }
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<DonationResponse>> GetDonorHistoryAsync(int donorId)
        {
            return await _context.Donations
                .Include(d => d.Donor)
                .Include(d => d.HelpRequest)
                .Where(d => d.DonorId == donorId)
                .Select(d => MapToResponse(d))
                .ToListAsync();
        }

        public async Task<IEnumerable<DonationResponse>> GetCaseDonationsAsync(int helpRequestId)
        {
            return await _context.Donations
                .Include(d => d.Donor)
                .Include(d => d.HelpRequest)
                .Where(d => d.HelpRequestId == helpRequestId && d.Status == DonationStatus.Completed)
                .Select(d => MapToResponse(d))
                .ToListAsync();
        }

        public async Task<IEnumerable<DonationResponse>> GetAllDonationsAsync()
        {
            return await _context.Donations
                .Include(d => d.Donor)
                .Include(d => d.HelpRequest)
                .Select(d => MapToResponse(d))
                .ToListAsync();
        }

        private static DonationResponse MapToResponse(Donation d)
        {
            return new DonationResponse
            {
                Id = d.Id,
                DonorId = d.DonorId,
                DonorName = d.Donor?.Name ?? "Unknown",
                HelpRequestId = d.HelpRequestId,
                HelpRequestTitle = d.HelpRequest?.Title,
                Amount = d.Amount,
                Currency = d.Currency,
                Status = d.Status.ToString(),
                PaymentMethod = d.PaymentMethod,
                TransactionId = d.TransactionId,
                CreatedAt = d.CreatedAt
            };
        }
    }
}
