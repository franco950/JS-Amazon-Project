class Order {
    _id;
    userid;
    products;
    overallcost;
    status;
    createdAt;
    updatedAt;
    
  
    constructor(orderDetails) {
      this._id = orderDetails._id;
      this.userid = orderDetails.userid;
      this.products = orderDetails.products;
      this.overallcost = orderDetails.overallcost;
      this.status = orderDetails.status;
      this.createdAt = orderDetails.createdAt;
      this.updatedAt=orderDetails.updatedAt;
    }
  
  }
export function getcost(num){
  return (num/100).toFixed(2)
}
export let orders = [];

export function loadOrdersFetch(userid) {
  const promise = fetch(
    'http://localhost:3000/api/orders',{

      method: 'GET',
      headers: {"Content-Type": "application/json",
        "userid": userid
      }}
  ).then((response) => {
    return response.json();
  }).then((orderData) => {
    orders = orderData.map((orderDetails) => {
      
      return new Order(orderDetails);
    }); 
    
  }).catch((error) => {
    console.log('Unexpected error. Please try again later. ERROR :'+error);
  });

  return promise;
}
