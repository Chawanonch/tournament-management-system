using System.ComponentModel.DataAnnotations;

namespace BlazorApp1.Models
{
    public class Product
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        [Range(10.00, 100.99)]
        public double Price { get; set; }
        [Required]
        [Range(1, 10)]
        public double Amount { get; set; }
        [Required]
        public SD.Category Category { get; set; }
    }
}
