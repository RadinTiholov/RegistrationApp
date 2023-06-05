import { showView } from './utils.js';

const section = document.querySelector('#confirm-email');
const button = document.getElementById('resend-email-button');
form.addEventListener('click', onClick);

export function confirmPage() {
    showView(section);
}

async function onClick(e){
    e.preventDefault();

    const emailElement = document.getElementById('re-confirm-email');
    const firstNameElement = document.getElementById('re-confirm-name');



    button.textContent = "Sent successfully!"
}