document.addEventListener('DOMContentLoaded', () => {
    const cartSummaryContainer = document.getElementById('cart-summary-container');
    const totalAmountElement = document.getElementById('total-amount');
    
    // Retrieve cart from local storage
    const cart = JSON.parse(localStorage.getItem('picopay_cart')) || [];
    
    // Function to render cart items
    function renderCartItems() {
        cartSummaryContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartSummaryContainer.innerHTML = '<p class="text-gray-500">Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const itemElement = document.createElement('div');
                itemElement.className = 'flex justify-between items-center';
                itemElement.innerHTML = `
                    <div>
                        <p class="font-semibold">${item.name}</p>
                        <p class="text-sm text-gray-400">Quantity: ${item.quantity}</p>
                    </div>
                    <p class="font-semibold">$${itemTotal.toFixed(2)}</p>
                `;
                cartSummaryContainer.appendChild(itemElement);
            });
        }
        
        totalAmountElement.textContent = `$${total.toFixed(2)}`;
    }

    renderCartItems();

    // Handle payment form submission
    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would typically integrate a payment gateway like Stripe or PayPal
        alert('Payment processing is not implemented in this demo.');
    });
});
