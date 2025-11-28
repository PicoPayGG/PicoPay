// checkout.js

const stripe = Stripe('pk_test_TYooMQauvdEDq54NiT aot5KztLV2'); // Replace with your actual publishable key
const elements = stripe.elements();

// Custom styling for Stripe Elements
const style = {
    base: {
        color: '#f3f4f6', // text-light
        fontFamily: 'Inter, sans-serif',
        fontSize: '16px',
        '::placeholder': {
            color: '#9ca3af', // gray-400
        },
    },
    invalid: {
        color: '#ef4444', // red-500
        iconColor: '#ef4444',
    },
};

// Create an instance of the card Element.
const card = elements.create('card', { style: style });

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.on('change', function(event) {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});

// Handle form submission
const form = document.getElementById('payment-form');
form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();

    if (!email) {
        document.getElementById('card-errors').textContent = 'Please enter your email.';
        return;
    }

    // Disable the submit button to prevent multiple clicks
    const submitButton = document.getElementById('submit-button');
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';

    const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: card,
        billing_details: {
            email: email,
        },
    });

    if (error) {
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = error.message;
        submitButton.disabled = false;
        submitButton.textContent = 'Pay Now';
    } else {
        // In a real application, you would send paymentMethod.id to your server
        // for further processing (e.g., creating a Charge or PaymentIntent).
        console.log('Stripe PaymentMethod:', paymentMethod);

        // Simulate successful payment
        alert('Payment successful! Your order has been placed.');
        localStorage.removeItem('picopay_cart'); // Clear the cart
        window.location.href = 'index.html'; // Redirect to home page
    }
});

// Render cart items on the checkout page
document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('picopay_cart')) || [];
    const cartSummaryContainer = document.getElementById('cart-summary-container');
    const totalAmountElement = document.getElementById('total-amount');
    let total = 0;

    if (cart.length === 0) {
        cartSummaryContainer.innerHTML = '<p class="text-gray-500 italic text-center">Your cart is empty. Please add items before checking out.</p>';
        document.getElementById('submit-button').disabled = true;
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const itemEl = document.createElement('div');
            itemEl.className = 'flex justify-between items-center';
            itemEl.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>$${itemTotal.toFixed(2)}</span>
            `;
            cartSummaryContainer.appendChild(itemEl);
        });
    }
    totalAmountElement.textContent = `$${total.toFixed(2)}`;
});
