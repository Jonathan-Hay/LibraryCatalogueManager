//this file is for ajax requests to delete products

//There are multiple delete buttons, one on each product listed. So We get them all
const deleteBookButtonElements = document.querySelectorAll('.product-item button');
console.log(deleteBookButtonElements.length);
async function deleteBook(event) {
    console.log("???");
    //get the specific button that was pressed
    const buttonElement = event.target;
    //get the product id from the dataset added in the book-item.ejs file to the button
    const bookId = buttonElement.dataset.bookid;

    //We use fetch for ajax request
    //by default this is a get request, so we need to configure it to tell it we want delete 
    //we also add a crsf token or else else the requiest will be blocked (crsf also affects front end js) 
    //the crsf token needs to match data-csrf on product-iten.ejs
    const response = await fetch('/admin/products/' + bookId, {
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
for (const deleteBookButtonElement of deleteBookButtonElements) {
    console.log("11");
    deleteBookButtonElement.addEventListener('click', deleteBook);
}