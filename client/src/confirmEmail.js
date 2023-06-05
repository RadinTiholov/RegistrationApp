import { showView } from './utils.js';

const section = document.querySelector('#confirm-email');
const button = document.getElementById('resend-email-button');
button.addEventListener('click', onClick);

export function confirmPage() {
    showView(section);
}

async function onClick(e) {
    e.preventDefault();

    const emailElement = document.getElementById('re-confirm-email');
    const firstNameElement = document.getElementById('re-confirm-name');

    try {
        const res = await fetch('http://localhost:3030/api/users/re-send-email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: emailElement.textContent, firstName: firstNameElement.textContent })
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
        }

        button.textContent = "Sent successfully!"
    } catch (err) {
        alert(err.message);
    }
}