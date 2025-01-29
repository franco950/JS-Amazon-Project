import {products,loadProductsFetch} from "../data/products.js";
import{cart} from "../data/cart.js"
import { shippingdetails } from "../data/shipping.js";
console.log(dayjs)

let pagetext='';
let checkout=document.querySelector('.order-summary')
let selected = [];
// Create a Map for quick lookups
  loadProductsFetch().then(()=>{
    getlist()
    renderHtml()
    deletebtn()
    selectdate()
    
    
  })
function selectdate(){
  let summarytext=document.querySelector('.payment-summary')
  summarytext.innerHTML=''
  let pretext=`<button class="place-order-button confirmorderbutton button-primary">
      confirm </button>`
  const today=dayjs()
  let dayscount=0;
  document.querySelectorAll('.delivery-option-input').forEach((input)=>{
    input.addEventListener("change",()=>{
      let checked=input.value
      const days=today.add(checked,'days')
      const newdate=days.format('dddd MMMM D')
      let itemId = input.dataset.id
      
      selected.forEach((item)=>{
        if (itemId==item.id){
          dayscount+=1
          item.deliverydate=newdate
          item.days=checked
          console.log('days supposed to be '+checked)
          console.log(item.days)
          if (dayscount==selected.length){summarytext.innerHTML=pretext;prerenderpayment()}
        }
      })
      itemId=CSS.escape(itemId)
      const date = document.querySelector(`#${itemId} .delivery-date`);
      date.innerHTML=`Delivery date: ${newdate}`
      console.log(selected)})})
      
      }


function getday(num){
  const today=dayjs()
  const days=today.add(num,'days')
  let format=days.format('dddd MMMM D')
  return format
}

function getlist(){
const productsMap = new Map(products.map((item) => [item.id, { ...item }]));
cart.forEach((element) => {
  if (productsMap.has(element.id)) {
    // Get the product and update quantity
    const product = productsMap.get(element.id);
    product.quantity = element.quantity;
    selected.push(product); }
  })
  }
  function renderHtml(){
    
    selected.forEach((item) => {
      pagetext+=`<div class="cart-item-container" id=${item.id}>
  <div class="delivery-date">
    Delivery date: no date selected
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
function deletebtn(){
  document.querySelectorAll('.delete-quantity-link').forEach((button)=>{
    button.addEventListener("click",()=>{
        let id=button.dataset.id
        console.log(id)
        deleteitem(id)})})
}
function deleteitem(id){
    const index=cart.findIndex((stuff)=>stuff.id==id)
    if (index !==-1){
        cart.splice(index,1) 
        console.log('cart'+cart)
        console.log('selected list'+selected)
        getlist()
        renderPaymentSummary()
        console.log('selected after getlist'+selected)
    }
    else{
        console.log('something went wrong')
    }
    localStorage.setItem('cart',JSON.stringify(cart))  
    let cartitem=document.getElementById(id)
    cartitem.remove()
    updatecheckout()
}
function prerenderpayment(){ 
  let quantity=0;
  cart.forEach((item) =>{
      quantity+=item.quantity
  })
let total=0;
let shippingtotal=0;
let tax=0;
let paymentdata=[]
selected.forEach((item)=>{
  total+=(item.priceCents*item.quantity)
  console.log(total)
  let shippingkey=item.days
  console.log('worristhis'+item.days)
  if(shippingdetails[shippingkey] !='FREE'){shippingtotal+=Number(shippingdetails[shippingkey])}})
  tax=(total+shippingtotal)*0.1
  console.log('type oftax '+typeof(tax)+typeof(shippingtotal)+typeof(total))
  paymentdata.push({shippingcost:shippingtotal},{total:total},{tax:tax})
  let overallcost=total+tax+shippingtotal;
  let order=document.querySelector('.confirmorderbutton')
  order.addEventListener('click',()=>{

    if (typeof tax === "number" && !isNaN(tax))
      {console.log('thisistax '+tax);renderPaymentSummary(quantity,total,shippingtotal,tax,overallcost)}
    else{console.log('type oftax '+typeof(tax)+typeof(shippingtotal)+typeof(total));return alert('please fill deliverydate fields')}})
  
}
function decimate(num){
  let decimated=(num/100).toFixed(2)
  return decimated
  
}
function renderPaymentSummary(quantity,total,shippingtotal,tax,overallcost){
  let summarytext=document.querySelector('.payment-summary')
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
orderbutton.addEventListener('click',()=>{
  sendorder()})}

function sendorder(){
  const promise = fetch(
    'https://supersimplebackend.dev/orders', {method:'POST',headers: {
    "Content-Type": "application/json"},body: JSON.stringify(selected) }
  ).then((response) => {
    console.log(response.json())
    return response.json();
  }).catch((error) => {
    console.log('Unexpected order post error. Please try again later.'+error);})
  return promise}
