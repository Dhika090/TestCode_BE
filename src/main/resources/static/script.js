document.addEventListener('DOMContentLoaded', function() {
    fetchProducts();

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
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            alert(`Product with ID ${productId} has been successfully deleted.`);
            fetchProducts(); // Pastikan fetchProducts didefinisikan di tempat lain
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
                closeCartModal(); // Tutup pop-up setelah menambahkan produk ke keranjang
                fetchCart(); // Refresh data keranjang
            } else {
                alert('Failed to add product to cart');
            }
        })
        .catch(error => console.error('Error adding to cart:', error));
}
function updateTotalPrice() {
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
}