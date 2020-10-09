using Microsoft.EntityFrameworkCore;

namespace ContactManagement.Models
{
    public class ContactAppContext : DbContext
    {
          public ContactAppContext(DbContextOptions<ContactAppContext> options)
            : base(options)
            {
            }

         public DbSet<Contact> Contact { get; set; }

    }
}