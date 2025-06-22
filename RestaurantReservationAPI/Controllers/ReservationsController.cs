using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantReservationAPI.Data;
using RestaurantReservationAPI.Models;
using RestaurantReservationAPI.Utils;

namespace RestaurantReservationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReservationsController : ControllerBase
    {
        private readonly ReservationContext _context;
        private readonly ReservationNotifier _notifier;

        public ReservationsController(ReservationContext context, ReservationNotifier notifier)
        {
            _context = context;
            _notifier = notifier;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations()
        {
            var role = User.FindFirstValue("role") ?? User.FindFirstValue(ClaimTypes.Role);
            var userIdStr = User.FindFirstValue("userId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userIdStr == null)
                return Unauthorized();

            var userId = int.Parse(userIdStr);

            if (role == "Manager")
            {
                
                return await _context.Reservations
                    .Include(r => r.Table)
                    .Include(r => r.User)
                    .ToListAsync();
            }
            else
            {
                
                return await _context.Reservations
                    .Where(r => r.UserId == userId)
                    .Include(r => r.Table)
                    .Include(r => r.User)
                    .ToListAsync();
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Reservation>> GetReservation(int id)
        {
            var reservation = await _context.Reservations.Include(r => r.Table).FirstOrDefaultAsync(r => r.Id == id);
            if (reservation == null)
                return NotFound();

            var role = User.FindFirstValue("role");
            var userIdClaim = User.FindFirstValue("userId");

            if (role != "Manager" && (!int.TryParse(userIdClaim, out int userId) || reservation.UserId != userId))
                return Forbid();

            return Ok(reservation);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutReservation(int id, [FromBody] Reservation updatedReservation)
        {
            var role = User.FindFirstValue("role") ?? User.FindFirstValue(ClaimTypes.Role);
            var userIdStr = User.FindFirstValue("userId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (role != "Manager" || userIdStr == null)
                return Forbid();

            var existingReservation = await _context.Reservations.FindAsync(id);
            if (existingReservation == null)
                return NotFound();

            existingReservation.CustomerName = updatedReservation.CustomerName;
            existingReservation.ReservationTime = updatedReservation.ReservationTime;
            existingReservation.TableId = updatedReservation.TableId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Reservations.AnyAsync(r => r.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult> PostReservation(Reservation reservation)
        {
            var userIdClaim = User.FindFirstValue("userId");

            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized("Invalid userId claim");

            reservation.UserId = userId;

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            _notifier.NotifyReservationCreated(reservation.CustomerName); // <- Observer działa

            return Ok(new
            {
                message = $"Rezerwacja dla {reservation.CustomerName} została dodana!"
            });
        }



        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var role = User.FindFirstValue("role") ?? User.FindFirstValue(ClaimTypes.Role);
            if (role != "Manager")
                return Forbid();

            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null)
                return NotFound();

            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private bool ReservationExists(int id)
        {
            return _context.Reservations.Any(e => e.Id == id);
        }
    }
}
