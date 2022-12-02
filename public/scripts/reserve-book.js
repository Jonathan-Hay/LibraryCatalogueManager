// const addToCartButtonElement = document.querySelector('#product-details button');
// // get the cart item count element (both of them, the desktop badge and the mobile one too)
// const cartBadgeElements = document.querySelectorAll('.nav-items .badge');

// async function addToCart() {
//   // We can get the product id from the data property thats on the button
//   const productId = addToCartButtonElement.dataset.productid;

//   // Ajax request. Need to tell it its a post, and ndeed to tell it the productID that we want to add 
//   let response;
//   try {
//     response = await fetch('/cart/items', {
//       method: 'POST',
//       body: JSON.stringify({
//         productId: productId,
//       }),
//       // The is the metadata that we need dto always add, normally its done manually but for custom requests such as this
//       //we need to specify. Since we are sending json data we say that 
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//   // Technical error for eg losing connectivity 
//   } catch (error) {
//     alert('Something went wrong!');
//     return;
//   }
  
//   if (!response.ok) {
//     alert('Something went wrong!!');
//     console.log(response);
//     return;
//   }

//   //decode the resposne data 
//   const responseData = await response.json();
//   //The addCartItem function in cart controller responds with a js object we defined which had a newTotalItems key
//   const newTotalQuantity = responseData.newTotalItems;

//   //update both the badge elements (2 in list, mobile and desktop)
//   for (const cartBadgeElement of cartBadgeElements) {
//     cartBadgeElement.textContent = newTotalQuantity;
//   }
// }

// addToCartButtonElement.addEventListener('click', addToCart);