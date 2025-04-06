using BlazorApp1.Models;

namespace BlazorApp1.Services
{
    public interface IProductService
    {
        void GenData(int number);
        void Add(Product product);
        void Delete(int id);
        void Edit(Product product);
    }
}
