export function getProduct(productId) {
  let matchingProduct;
  products.forEach((product) => {
    
    if (product.id == productId) {
      matchingProduct = product;
    }
  });
  return matchingProduct;
}

class Product {
  id;
  image;
  name;
  rating;
  priceCents;
  deliverydate;
  days;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
    this.deliverydate;
    this.days;
  }

}


export let products = [];

export function loadProductsFetch() {
  const promise = fetch(
    'http://localhost:3000/api/products'
  ).then((response) => {
    return response.json();
  }).then((productsData) => {
    products = productsData.map(productDetails => new Product(productDetails)); 
  }).catch((error) => {
    console.log('Unexpected error fetching products. Please try again later. error is:'+error);
  });

  return promise;
}
