import { showView, updateNav } from './utils.js';
import { updatePage } from './update.js';

const section = document.querySelector('#form-login');
const form = section.querySelector('form');
form.addEventListener('submit', onSubmit);

export function loginPage() {
    showView(section);
}

async function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(form);

    const email = formData.get('email');
    const password = formData.get('password');

    await login(email, password);
    form.reset();
    updateNav();

    updatePage();
}

async function login(email, password) {
    let messageElement = document.getElementById("login-error-message");
    // Check if any of the input parameters are empty
    if (!email || !password) {
        messageElement.textContent = 'Please fill in all the fields.';
        return;
    }

    try {
        const res = await fetch('http://localhost:3030/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
        }

        const user = await res.json();
        localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
        alert(err.message);
        throw err;
    }
}