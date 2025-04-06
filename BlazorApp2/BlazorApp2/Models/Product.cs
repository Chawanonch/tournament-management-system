using System.ComponentModel.DataAnnotations;

namespace BlazorApp2.Models
{
    public class Product
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public double Price { get; set; }
        [Required]
        public double Amount { get; set; }
        public SD.Category Category { get; set; }
    }
}
