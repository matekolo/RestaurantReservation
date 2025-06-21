using Microsoft.EntityFrameworkCore;
using RestaurantReservationAPI.Models;
namespace RestaurantReservationAPI.Data
{
    public class ReservationContext : DbContext
    {
        public ReservationContext(DbContextOptions<ReservationContext> options)
            : base(options)
        {
        }

        public DbSet<Table> Tables { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
    }
}
