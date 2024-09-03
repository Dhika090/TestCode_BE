document.addEventListener('DOMContentLoaded', function() {
    fetchProducts();
    fetchCart();

    // Event listener untuk submit form
    document.getElementById('productForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addProduct();
    });
    document.getElementById('cartForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addToCart();
    });
});

function openModal() {
    document.getElementById('modalOverlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
}

function openCartModal() {
    document.getElementById('cartModalOverlay').style.display = 'flex';
}

function closeCartModal() {
    document.getElementById('cartModalOverlay').style.display = 'none';
}

let totalPrice = 0;
function fetchProducts() {
    fetch('/api/products?page=0&size=10')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('productTableBody');
            tableBody.innerHTML = '';
            totalPrice = 0;
            data.content.forEach(product => {
                const row = `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.type}</td>
                        <td>${product.price}</td>
                        <td>
                            <button onclick="deleteProduct(${product.id})">Delete</button>
                        </td>
                    </tr>
                `;
                totalPrice += product.price;
                tableBody.innerHTML += row;
            });
            updateTotalPrice();
        })
        .catch(error => console.error('Error fetching products:', error));
}

function addProduct() {
    const name = document.getElementById('name').value;
    const type = document.getElementById('type').value;
    const price = document.getElementById('price').value;

    const product = {
        name: name,
        type: type,
        price: parseFloat(price)
    };

    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
        .then(response => {
            if (response.ok) {
                alert('Product added successfully!');
                closeModal();
                fetchProducts();
                document.getElementById('productForm').reset();
                totalPrice += price;
                updateTotalPrice();
            } else {
                alert('Failed to add product');
            }
        })
        .catch(error => console.error('Error adding product:', error));
}

function deleteProduct(productId) {
    fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error('Error details:', errorData);
                    throw new Error('Failed to delete product: ' + (errorData.message || 'Unknown error'));
                });
            }
            alert(`Product with ID ${productId} has been successfully deleted.`);
            fetchProducts();
        })
        .catch(error => console.error('Error deleting product:', error));
}

function addToCart() {
    const productId = document.getElementById('productId').value;
    const quantity = document.getElementById('quantity').value;

    fetch(`/api/cart/add?productId=${productId}&quantity=${quantity}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                alert('Product added to cart successfully!');
                document.getElementById('cartForm').reset();
                closeCartModal();
                fetchCart();
            } else {
                alert('Failed to add product to cart');
            }
        })
        .catch(error => console.error('Error adding to cart:', error));
}
function fetchCart() {
    fetch('/api/cart')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched cart data:', data);

            const cartTableBody = document.getElementById('cartTableBody');
            const cartContainer = document.getElementById('cartContainer');
            const totalCartElement = document.getElementById('totalCart');

            if (data.items && data.items.length > 0) {
                cartTableBody.innerHTML = '';
                let total = 0;

                data.items.forEach(item => {
                    const itemTotalCart = item.quantity * item.product.price;
                    total += itemTotalCart;

                    const row = `
                        <tr>
                            <td>${item.product.name}</td>
                            <td>${item.product.type}</td>
                            <td>${item.product.price}</td>
                            <td>${item.quantity}</td>
                            <td>${itemTotalCart.toFixed(2)}</td>
                        </tr>
                    `;
                    cartTableBody.innerHTML += row;
                });
                cartContainer.style.display = 'block';
                totalCartElement.textContent = `${total.toFixed(2)}`;
            } else {
                cartContainer.style.display = 'none';
            }
        })
        .catch(error => console.error('Error fetching cart items:', error));
}

function Checkout() {
    fetch('/api/cart/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error('Error during checkout:', errorData);
                    throw new Error('Checkout failed: ' + (errorData.message || 'Unknown error'));
                });
            }
            return response.json();
        })
        .then(data => {
            alert('Checkout successful!');

            const cartTableBody = document.getElementById('cartTableBody');
            cartTableBody.innerHTML = '';

            const cartContainer = document.getElementById('cartContainer');
            cartContainer.style.display = 'none';

            const totalCartElement = document.getElementById('totalCart');
            totalCartElement.style.display = 'none';

            const emptyCartMessage = document.getElementById('emptyCartMessage');
            emptyCartMessage.style.display = 'block';
        })
        .catch(error => {
            console.error('Error during checkout:', error);
            alert('Checkout failed. Please try again.');
        });
}


function updateTotalPrice() {
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
}