using System;

namespace RestaurantReservationAPI.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public DateTime ReservationTime { get; set; }
        public int TableId { get; set; }

        public Table? Table { get; set; }
    }
}
