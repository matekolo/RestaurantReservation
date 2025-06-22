using System;

namespace RestaurantReservationAPI.Utils
{
    public class ReservationNotifier
    {
        public event Action<string>? OnReservationCreated;

        public void NotifyReservationCreated(string customerName)
        {
            OnReservationCreated?.Invoke(customerName);
        }
    }
}
