using BlazorApp1.Models;

namespace BlazorApp1.Services
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

        public void GenData(int number = 10)
        {
            for (int i = 1; i <= number; i++)
            {
                ProductList.Add(new Product
                {
                    Id = i,
                    Name = "Product" + i,
                    Price = rnd.Next(10, 101) + rnd.NextDouble(),
                    Amount = rnd.Next(1, 11)
                });
            }
        }

        public void Add(Product product)
        {
            if(ProductList.Count > 0)
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
            if(product != null)
            {
                ProductList.Remove(product);
            }
        }

        public void Edit(Product product)
        {
            //var productFind = ProductList.FirstOrDefault(x => x.Id.Equals(product.Id));
            //if (productFind != null)
            //{
            //    productFind.Id = product.Id;
            //    productFind.Name = product.Name;
            //    productFind.Price = product.Price;
            //    productFind.Amount = product.Amount;
            //    productFind.Category = product.Category;
            //}

            var oldProduct = ProductList.FirstOrDefault(x => x.Id.Equals(product.Id));
            if (oldProduct != null)
            {
                var index = ProductList.IndexOf(oldProduct);
                if (index >= 0)
                {
                    ProductList.RemoveAt(index);
                    ProductList.Insert(index, product);
                }
            }
        }
    }
}
