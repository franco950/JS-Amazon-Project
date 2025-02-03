import { loadProductsFetch,products, getProduct } from "../data/products.js";
import { loadOrdersFetch ,orders,getcost} from "../data/orders.js";

//for now, userid is 9500, i dont have a user database yet
const userid=9500

loadOrdersFetch(userid)
.then(()=>{return loadProductsFetch()})
.then(()=>{renderpage()})  
.catch((error) => {console.error("An error occurred:", error)});

function renderpage(){
    let orderpage=document.querySelector('.orders-grid')
    let fragment = document.createDocumentFragment();
    orders.forEach((item) => {
      
      let div = document.createElement("div");
      div.classList.add("order-container");
      div.id = item._id;
      div.innerHTML= `     
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${item.createdAt}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${getcost(item.overallcost)}</div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${item._id}</div>
        </div>
      </div>`
    item.products.forEach((product)=>{
      let specific;
      if (product.id !==undefined){
      specific=getProduct(product.id)
      let productHTML=`<div class="order-details-grid">
        <div class="product-image-container">
          <img src=${specific.image}>
        </div>

        <div class="product-details">
          <div class="product-name">
           ${specific.name}
          </div>
          <div class="product-delivery-date">
            Arriving on:${product.deliverydate}
          </div>
          <div class="product-quantity">
            Quantity: ${product.quantity}
          </div>
          <a href="amazon.html"><button class="buy-again-button button-primary">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button></a>
        </div>

        <div class="product-actions">
          <a href="tracking.html">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      </div>`
      div.innerHTML+=productHTML}})
      fragment.appendChild(div);
  });
  orderpage.innerHTML = ""; 
  orderpage.appendChild(fragment);
}