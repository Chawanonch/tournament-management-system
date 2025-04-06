using BlazorApp3.Models;

namespace BlazorApp3.Services
{
    public interface IFoodService
    {
        void GenData(int number);
        void GetAll();
        List<IGrouping<SD.Types,Food>> GroupByType();
        void Delete(int id);
        void Add(Food food);
        void Edit(Food food);
    }
}
