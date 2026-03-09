using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<HelpRequest> HelpRequests { get; set; }
        public DbSet<Donation> Donations { get; set; }
        public DbSet<Payout> Payouts { get; set; }
    }
}
