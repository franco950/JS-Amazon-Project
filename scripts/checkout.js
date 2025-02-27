import {products,loadProductsFetch} from "../data/products.js";
import{cart} from "../data/cart.js"
import { shippingdetails } from "../data/shipping.js";

let checkout=document.querySelector('.order-summary')
let summarytext=document.querySelector('.payment-summary')
const selected = [];
function loadpage(){
loadProductsFetch().then(()=>{
  getlist()
  renderHtml()
  deletebtn()
  selectdate()
  updatecheckout()
})}
loadpage()
function selectdate(){
  const today=dayjs()
  let dayscount=0;
  document.body.addEventListener("change", (event) => {
    if (event.target.classList.contains("delivery-option-input")) {
      const input = event.target;
      let checked = input.value;
      const days=today.add(checked,'days')
      let newdate=days.format('dddd MMMM D')
      let itemId = input.dataset.id
      selected.forEach((item)=>{
        if (itemId==item.id){
          dayscount+=1
          item.deliverydate=newdate
          item.days=checked
          if (dayscount==selected.length){prerenderpayment()}
        }
      })
      itemId=CSS.escape(itemId)
      const date = document.querySelector(`#${itemId} .delivery-date`);
      date.innerHTML=`Delivery date: ${newdate}`
    }
  })      
}

function getday(num){
  const today=dayjs()
  const days=today.add(num,'days')
  let format=days.format('dddd MMMM D')
  return format
}

function getlist(){
const productsMap = new Map(products.map((item) => [item.id, { ...item }]));
selected.length = 0;
selected.push(...cart.filter(item => productsMap.has(item.id)).map(item => ({
  ...productsMap.get(item.id),
  quantity: item.quantity
})));

  }
  function renderHtml(){
    let fragment = document.createDocumentFragment();
    if (cart.length==0){
      let backtitle=document.querySelector('.page-title')
      backtitle.innerHTML=`There are no items in your cart`
      let backhome=document.querySelector('.checkout-grid')
      backhome.innerHTML=`<p><a href='amazon.html'><button class="place-order-button finalorder button-primary">
        Back to homepage
       </button></a></p>`
    }
    selected.forEach((item) => {
      console.log(item.deliverydate)
      let div = document.createElement("div");
      div.classList.add("cart-item-container");
      div.id = item.id;
      div.innerHTML=`<div class="cart-item-container" id=${item.id}>
  <div class="delivery-date">
    Delivery date: No date selected
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
        <span class="delete-quantity-link link-primary" data-id=${item.id}>
          Delete
        </span>
      </div>
    </div>
  
    <div class="delivery-options" data-id=${item.id}>
      <div class="delivery-options-title">
        Choose a delivery option:
      </div>
      <div class="delivery-option">
        <input type="radio" data-id=${item.id}
          class="delivery-option-input"
          name="delivery-option-7" value=7>
        <div>
          <div class="delivery-option-date">
           ${getday(7)}
          </div>
          <div class="delivery-option-price">
            FREE Shipping
          </div>
        </div>
      </div>
      <div class="delivery-option">
        <input type="radio" data-id=${item.id}
          class="delivery-option-input"
          name="delivery-option-3"value=3>
        <div>
          <div class="delivery-option-date">
            ${getday(3)}
          </div>
          <div class="delivery-option-price">
            $4.99 - Shipping
          </div>
        </div>
      </div>
      <div class="delivery-option">
        <input type="radio"data-id=${item.id}
          class="delivery-option-input"
          name="delivery-option-1"value=1>
        <div>
          <div class="delivery-option-date">
            ${getday(1)}
          </div>
          <div class="delivery-option-price">
            $9.99 - Shipping
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>`
  fragment.appendChild(div);
  });
  checkout.innerHTML = ""; 
  checkout.appendChild(fragment);
}

function updatecheckout(){
  let total=document.querySelector('.return-to-home-link')
  let quantity=0;
  cart.forEach((item) =>{
      quantity+=item.quantity
  })
  console.log(cart)
  total.innerHTML=quantity+' items'
}

function deletebtn(){
  document.body.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-quantity-link")) {
      deleteitem(event.target.dataset.id);
    }
  });
}

function deleteitem(id){
    const index=cart.findIndex((stuff)=>stuff.id==id)
    if (index !==-1){
        cart.splice(index,1) 
        localStorage.setItem('cart',JSON.stringify(cart))
        const selectedindex=selected.findIndex((item)=>item.id==id)
        if (selectedindex !==-1){
        selected.splice(selectedindex,1)}
        let cartitem=document.getElementById(id)
        cartitem.remove()
        loadpage()}
    else{
        console.log('something went wrong')
    }
}

function prerenderpayment(){ 
  let pretext=`<button class="place-order-button confirmorderbutton button-primary">confirm </button>`
  summarytext.innerHTML=pretext
  let quantity=0;
  let total=0;
  let shippingtotal=0;
  let tax=0;
  if (cart.length==0){pretext=''}
  selected.forEach((item)=>{
    quantity+=item.quantity
    total+=(item.priceCents*item.quantity)
    let shippingkey=item.days
    if(shippingdetails[shippingkey] !='FREE'){shippingtotal+=Number(shippingdetails[shippingkey])}})
  tax=(total+shippingtotal)*0.1
  let overallcost=total+tax+shippingtotal;
  selected.push(overallcost)
  let order=document.querySelector('.confirmorderbutton')
  order.addEventListener('click',()=>{
    if (typeof tax === "number" && !isNaN(tax)){
      renderPaymentSummary(quantity,total,shippingtotal,tax,overallcost)}
    else{
      return alert('please fill deliverydate fields')}})
}

function decimate(num){
  let decimated=(num/100).toFixed(2)
  return decimated
}

function renderPaymentSummary(quantity,total,shippingtotal,tax,overallcost){
 let innertext=`<div class="payment-summary-title">
  Order Summary
</div>
<div class="payment-summary-row">
  <div>Items (${quantity}):</div>
  <div class="payment-summary-money">$${decimate(total)}</div>
</div>

<div class="payment-summary-row">
  <div>Shipping &amp; handling:</div>
  <div class="payment-summary-money">$${decimate(shippingtotal)}</div>
</div>

<div class="payment-summary-row subtotal-row">
  <div>Total before tax:</div>
  <div class="payment-summary-money">$${decimate(total+shippingtotal)}</div>
</div>

<div class="payment-summary-row">
  <div>Estimated tax (10%):</div>
  <div class="payment-summary-money">$${decimate(tax)}</div>
</div>

<div class="payment-summary-row total-row">
  <div>Order total:</div>
  <div class="payment-summary-money">$${decimate(overallcost)}</div>
</div>

<button class="place-order-button finalorder button-primary">
  Place your order
</button>`

summarytext.innerHTML=innertext
let orderbutton=document.querySelector('.finalorder')
orderbutton.addEventListener('click',()=>{sendorder()})}

function sendorder(){ 
  if (!selected || selected.length === 0) {
    console.error("Error: No products selected.");
    return;
  }
  const orderData = selected.map(({ id, quantity, deliverydate,days }) => ({ id, quantity, deliverydate, days }));
  let overallcost=selected[selected.length - 1];
  const order={userid:"9500",products:orderData,overallcost:overallcost,status:"preparing"}
  fetch(
    'http://localhost:3000/api/orders', {method:'POST',headers: {
    "Content-Type": "application/json"},body: JSON.stringify(order) }
  ).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }else{console.log('order sent!')
      alert('order sent successfully')
      cart.length=0
      localStorage.setItem('cart',JSON.stringify(cart))
      loadpage()
      let backhome=document.querySelector('.payment-summary')
      backhome.innerHTML=`<p>No items in cart</p><a href='amazon.html'><button class="place-order-button finalorder button-primary">
        Back to homepage
       </button></a>`
    }
    return response.json();
  }).then(data => console.log("Order response:", data)).catch((error) => {
    console.log('Unexpected order post error. Please try again later.'+error);})}
 