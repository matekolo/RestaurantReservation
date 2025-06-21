using System.Collections.Generic;
using System.Text.Json.Serialization;
namespace RestaurantReservationAPI.Models
{
    public class Table
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public int Seats { get; set; }
        public bool IsAvailable { get; set; } = true;
        [JsonIgnore]
        public ICollection<Reservation>? Reservations { get; set; }
    }
}
