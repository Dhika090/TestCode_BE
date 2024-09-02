document.addEventListener('DOMContentLoaded', function() {
    fetchProducts();

    // Event listener untuk submit form
    document.getElementById('productForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addProduct();
    });
});

function openModal() {
    document.getElementById('modalOverlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
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
                        <td>${product.description}</td>
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
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;

    const product = {
        name: name,
        description: description,
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
                closeModal(); // Tutup pop-up setelah menambahkan data
                fetchProducts(); // Refresh daftar produk setelah menambahkan data
                document.getElementById('productForm').reset(); // Reset form setelah pengiriman
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
        .then(() => {
            alert(`Product with ID ${productId} has been successfully deleted.`);
            fetchProducts(); // Refresh daftar produk setelah menghapus data
        })
        .catch(error => console.error('Error deleting product:', error));
}
function updateTotalPrice() {
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
}
