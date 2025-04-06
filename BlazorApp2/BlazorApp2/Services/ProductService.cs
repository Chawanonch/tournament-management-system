using BlazorApp2.Models;

namespace BlazorApp2.Services
{
    public class ProductService : IProductService
    {
        public List<Product> ProductList { get; set; }
        Random rnd;

        public ProductService()
        {
            ProductList = new List<Product>();
            rnd = new Random();
            GenData();
        }
        public void Add(Product product)
        {
            if (ProductList.Count > 0)
            {
                product.Id = ProductList.Max(x => x.Id) + 1;
            }
            else
            {
                product.Id = 1;
            }
            ProductList.Add(product);
        }

        public void Delete(int id)
        {
            var product = ProductList.FirstOrDefault(x => x.Id == id);

            if (product != null) ProductList.Remove(product);
        }

        public void Edit(Product product)
        {
            var oldProduct = ProductList.FirstOrDefault(x => x.Id.Equals(product.Id));
            if (oldProduct != null)
            {
                ProductList.Remove(oldProduct);
                ProductList.Add(product);
            }
        }

        public Product FindbyId(int id)
        {
            var product = ProductList.FirstOrDefault(x=>x.Id.Equals(id));
            return product;
        }

        public void GenData(int number = 10)
        {
            for (int i = 1; i <= number; i++)
            {
                ProductList.Add(new Product
                {
                    Id = i,
                    Name = "Product" + i,
                    Price = rnd.Next(10, 101) + rnd.NextDouble(),
                    Amount = rnd.Next(1, 11),
                });
            }
        }
    }
}
