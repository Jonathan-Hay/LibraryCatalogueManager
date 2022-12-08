//this file is for ajax requests to delete products

//There are multiple delete buttons, one on each product listed. So We get them all
const deleteProductButtonElements = document.querySelectorAll('.book-item button');

async function deleteProduct(event) {
    console.log("???");
    //get the specific button that was pressed
    const buttonElement = event.target;
    //get the product id from the dataset added in the book-item.ejs file to the button
    const productId = buttonElement.dataset.productid;

    //We use fetch for ajax request
    //by default this is a get request, so we need to configure it to tell it we want delete 
    //we also add a crsf token or else else the requiest will be blocked (crsf also affects front end js) 
    //the crsf token needs to match data-csrf on product-iten.ejs
    const response = await fetch('/admin/products/' + productId, {
        method: 'DELETE'
    });

    if (!response.ok) {
        alert('Something went wrong!');
        return;
    }
    
    //remove the product item from the page (the list item)
    buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

//Add the lister to every button
for (const deleteProductButtonElement of deleteProductButtonElements) {
    console.log("11");
    deleteProductButtonElement.addEventListener('click', deleteProduct);
}