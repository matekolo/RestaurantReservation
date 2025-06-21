using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantReservationAPI.Data;
using RestaurantReservationAPI.Models;

namespace RestaurantReservationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReservationsController : ControllerBase
    {
        private readonly ReservationContext _context;

        public ReservationsController(ReservationContext context)
        {
            _context = context;
        }

        // GET: api/Reservations
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
                // Manager widzi wszystkie rezerwacje
                return await _context.Reservations
                    .Include(r => r.Table)
                    .Include(r => r.User)
                    .ToListAsync();
            }
            else
            {
                // Zwykły użytkownik widzi tylko swoje rezerwacje
                return await _context.Reservations
                    .Where(r => r.UserId == userId)
                    .Include(r => r.Table)
                    .Include(r => r.User)
                    .ToListAsync();
            }
        }


        // GET: api/Reservations/5
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

        // PUT: api/Reservations/5
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

            // Aktualizujemy tylko dane widoczne w formularzu
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



        // POST: api/Reservations
        [HttpPost]
        public async Task<ActionResult<Reservation>> PostReservation(Reservation reservation)
        {
            var userIdClaim = User.FindFirstValue("userId");

            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized("Invalid userId claim");

            reservation.UserId = userId;

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id }, reservation);
        }

        // DELETE: api/Reservations/5
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
