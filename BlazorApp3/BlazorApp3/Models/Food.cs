using System.ComponentModel.DataAnnotations;

namespace BlazorApp3.Models
{
    public class Food
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public double Cost { get; set; }
        [Required]
        public SD.Types Type { get; set; }
        [Required]
        public double Cal { get; set; }
        public List<SD.Topping> Topping { get; set; }
        public string CostRate()
        {
            var star = Cost switch
            {
                >= 400 => "*****",
                >= 300 => "****",
                >= 200 => "***",
                >= 100 => "**",
                _ => "*",
            };
            return star;
        }
    }
}
