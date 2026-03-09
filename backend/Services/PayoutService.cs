using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class PayoutService : IPayoutService
    {
        private readonly AppDbContext _context;

        public PayoutService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PayoutResponse> RequestPayoutAsync(int needyId, PayoutRequest request)
        {
            var payout = new Payout
            {
                NeedyId = needyId,
                Amount = request.Amount,
                Status = PayoutStatus.Pending,
                RequestDate = DateTime.UtcNow
            };

            _context.Payouts.Add(payout);
            await _context.SaveChangesAsync();

            return MapToResponse(payout);
        }

        public async Task<IEnumerable<PayoutResponse>> GetPendingPayoutsAsync()
        {
            return await _context.Payouts
                .Include(p => p.Needy)
                .Where(p => p.Status == PayoutStatus.Pending)
                .Select(p => MapToResponse(p))
                .ToListAsync();
        }

        public async Task<bool> ApprovePayoutAsync(int payoutId, string adminNotes)
        {
            var payout = await _context.Payouts.FindAsync(payoutId);
            if (payout == null) return false;

            payout.Status = PayoutStatus.Approved;
            payout.AdminNotes = adminNotes;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectPayoutAsync(int payoutId, string adminNotes)
        {
            var payout = await _context.Payouts.FindAsync(payoutId);
            if (payout == null) return false;

            payout.Status = PayoutStatus.Rejected;
            payout.AdminNotes = adminNotes;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ProcessPayoutAsync(int payoutId)
        {
            var payout = await _context.Payouts.FindAsync(payoutId);
            if (payout == null || payout.Status != PayoutStatus.Approved) return false;

            payout.Status = PayoutStatus.Processed;
            payout.ProcessedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<PayoutResponse>> GetMyPayoutsAsync(int needyId)
        {
            return await _context.Payouts
                .Include(p => p.Needy)
                .Where(p => p.NeedyId == needyId)
                .Select(p => MapToResponse(p))
                .ToListAsync();
        }

        private static PayoutResponse MapToResponse(Payout p)
        {
            return new PayoutResponse
            {
                Id = p.Id,
                NeedyId = p.NeedyId,
                NeedyName = p.Needy?.Name ?? "Unknown",
                Amount = p.Amount,
                Status = p.Status.ToString(),
                RequestDate = p.RequestDate,
                ProcessedDate = p.ProcessedDate,
                AdminNotes = p.AdminNotes
            };
        }
    }
}
