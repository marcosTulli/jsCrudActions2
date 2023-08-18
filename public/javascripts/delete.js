document.getElementById('delete').onclick = function () {
  const value = document.getElementById('product-id').value;
  if (value === '') {
    processResult();
  } else {
    axios.delete(`/api/products/${value}`).catch((err) => {
      if (err.response.status === 404) {
        notFound();
      }
    });
    processResult(value);
  }
};

function processResult(value) {
  if (!value) {
    window.alert('Please, enter a product id');
  } else {
    window.alert(`Product with id ${value} deleted!`);
  }
}

function notFound() {
  resetContentArea();

  const h2 = document.querySelector('h2.hidden');
  h2.className = '';
}
