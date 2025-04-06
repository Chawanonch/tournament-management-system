using BlazorApp3.Models;

namespace BlazorApp3.Services
{
    public class FoodService : IFoodService
    {
        Random r;
        public List<Food> Foods;

        public FoodService()
        {
            r = new Random();
            Foods = new List<Food>();
            GenData();
        }

        public void GenData(int number = 5)
        {
            number = r.Next(20, 31);
            var availableToppings = Enum.GetValues(typeof(SD.Topping)).Cast<SD.Topping>().ToList();

            for (int i = 1; i <= number; i++)
            {
                var toppingCount = r.Next(1, 4);
                var toppings = availableToppings.OrderBy(x => x).Take(toppingCount).Distinct().ToList();

                Foods.Add(new Food
                {
                    Id = i,
                    Name = "Food" + i,
                    Cost = r.Next(30, 501) + r.NextDouble(),
                    Type = (SD.Types)r.Next(1, 6),
                    Cal = r.Next(30, 201) + r.NextDouble(),
                    Topping = toppings
                });
            }
        }

        public void GetAll()
        {
            throw new NotImplementedException();
        }

        public List<IGrouping<SD.Types, Food>> GroupByType()
        {
            return Foods.OrderBy(x => x.Type).GroupBy(x => x.Type).ToList();
        }

        public void Delete(int id)
        {
            var result = Foods.Find(x => x.Id == id);
            if (result != null) Foods.Remove(result);
        }

        public void Add(Food food)
        {
            var id = Foods.Max(x => x.Id) + 1;

            food.Id = id;
            Foods.Add(food);
        }

        public void Edit(Food food)
        {
            var oldFood = Foods.FirstOrDefault(x => x.Id.Equals(food.Id));

            var index = Foods.IndexOf(oldFood);
            if (index >= 0)
            {
                Foods.RemoveAt(index);
                Foods.Insert(index, food);
            }
        }
    }
}
