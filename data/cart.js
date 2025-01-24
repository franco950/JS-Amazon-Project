export const cart=[]
export function addtocart(productid){
  let matchingItem;
  let selected=document.querySelector(`.product-quantity-container select[data-product-id="${productid}"]`).value
  selected=Number(selected)
  cart.forEach((item)=>{
    if (item.id==productid){
      matchingItem=item;
    }})
    if (matchingItem){
      matchingItem.quantity+=selected
      console.log(cart)
    }
    else{ 
      cart.push({id:productid,quantity:selected})
      console.log(cart)
    }
}