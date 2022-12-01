
//browser-side js to prevent the deafult use of the form for updating the order staus as an admin, and sendnig an ajax
//request (patch)

//get all the forms inside order-actions class (therecould be multiple orders each with a order status drop down)
const updateOrderFormElements = document.querySelectorAll(
  '.order-actions form'
);

async function updateOrder(event) {
  event.preventDefault();
  const form = event.target;

  const formData = new FormData(form);
  const newStatus = formData.get('status');
  const orderId = formData.get('orderid');

  let response;

  try {
    response = await fetch(`/admin/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        newStatus: newStatus,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    alert('Something went wrong - could not update order status.');
    return;
  }

  if (!response.ok) {
    alert('Something went wrong - could not update order status.');
    return;
  }

  const responseData = await response.json();

  form.parentElement.parentElement.querySelector('.badge').textContent =
    responseData.newStatus.toUpperCase();
}

for (const updateOrderFormElement of updateOrderFormElements) {
  updateOrderFormElement.addEventListener('submit', updateOrder);
}
