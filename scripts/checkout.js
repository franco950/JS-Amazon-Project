import {products,loadProductsFetch} from "../data/products.js";
import{cart} from "../data/cart.js"
let pagetext='';
let checkout=document.querySelector('.order-summary')
let selected = [];
// Create a Map for quick lookups
  loadProductsFetch().then(()=>{
    getlist()
    renderHtml()
  })
  function getlist(){
    const productsMap = new Map(products.map((item) => [item.id, { ...item }]));
cart.forEach((element) => {
  if (productsMap.has(element.id)) {
    // Get the product and update quantity
    const product = productsMap.get(element.id);
    product.quantity = element.quantity;
    selected.push(product); 
  }
})
  }
  function renderHtml(){
    selected.forEach((item) => {
      pagetext+=`<div class="cart-item-container" id=${item.id}>
  <div class="delivery-date">
    Delivery date: Tuesday, June 21
  </div>
  
  <div class="cart-item-details-grid">
    <img class="product-image"
      src=${item.image}>
  
    <div class="cart-item-details">
      <div class="product-name">
        ${item.name}
      </div>
      <div class="product-price">
        $${(item.priceCents/100).toFixed(2)}
      </div>
      <div class="product-quantity">
        <span>
          Quantity: <span class="quantity-label">${item.quantity}</span>
        </span>
        <span class="update-quantity-link link-primary">
          Update
        </span>
        <span class="delete-quantity-link link-primary" id=${item.id}>
          Delete
        </span>
      </div>
    </div>
  
    <div class="delivery-options">
      <div class="delivery-options-title">
        Choose a delivery option:
      </div>
      <div class="delivery-option">
        <input type="radio" checked
          class="delivery-option-input"
          name="delivery-option-1">
        <div>
          <div class="delivery-option-date">
            Tuesday, June 21
          </div>
          <div class="delivery-option-price">
            FREE Shipping
          </div>
        </div>
      </div>
      <div class="delivery-option">
        <input type="radio"
          class="delivery-option-input"
          name="delivery-option-1">
        <div>
          <div class="delivery-option-date">
            Wednesday, June 15
          </div>
          <div class="delivery-option-price">
            $4.99 - Shipping
          </div>
        </div>
      </div>
      <div class="delivery-option">
        <input type="radio"
          class="delivery-option-input"
          name="delivery-option-1">
        <div>
          <div class="delivery-option-date">
            Monday, June 13
          </div>
          <div class="delivery-option-price">
            $9.99 - Shipping
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>`
  })
  checkout.innerHTML=pagetext
  }

function updatecheckout(){
    let total=document.querySelector('.return-to-home-link')
    let quantity=0;
    cart.forEach((item) =>{
        quantity+=item.quantity
    })
    total.innerHTML=quantity+' items'
}
updatecheckout()
document.querySelectorAll('.delete-quantity-link').forEach((button)=>{
    button.addEventListener("click",()=>{
        let id=button.id
        console.log(id)
        deleteitem(id)})})
function deleteitem(id){
    const index=cart.findIndex((stuff)=>stuff.id==id)
    if (index !==-1){
        cart.splice(index,1) 
        console.log(cart) 
    }
    else{
        console.log('something went wrong')
    }
    localStorage.setItem('cart',JSON.stringify(cart))  
    let cartitem=document.getElementById(id)
    cartitem.remove()
    updatecheckout()
}
