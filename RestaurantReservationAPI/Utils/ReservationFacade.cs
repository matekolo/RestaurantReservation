using RestaurantReservationAPI.Data;
using RestaurantReservationAPI.Models;
using System.Threading.Tasks;

namespace RestaurantReservationAPI.Utils
{
    public class ReservationFacade
    {
        private readonly ReservationContext _context;
        private readonly ReservationNotifier _notifier;

        public ReservationFacade(ReservationContext context, ReservationNotifier notifier)
        {
            _context = context;
            _notifier = notifier;
        }

        public async Task<Reservation> CreateReservationAsync(Reservation reservation)
        {
            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            _notifier.NotifyReservationCreated(reservation.CustomerName);

            return reservation;
        }
    }
}
