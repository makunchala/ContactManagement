using System;
using System.ComponentModel.DataAnnotations;

namespace ContactManagement.Models
{
    public class Contact
    {
        [Key]
        public long? id { get; set; }
        public string name { get; set; }
        public string company { get; set; }
        public string phone { get; set; }
        public string address { get; set; }
        public string email { get; set; }        
        public DateTime? lastDateContacted { get; set; }
    }
}