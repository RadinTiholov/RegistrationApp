import { showView, updateNav } from './utils.js';
import { confirmPage } from './confirmEmail.js';

const section = document.querySelector('#form-register');
const form = section.querySelector('form');

const captch = document.getElementById('captcha');
const getButton = document.getElementById('gen-button');

form.addEventListener('submit', onSubmit);
captch.addEventListener('load', generateCaptcha);
getButton.addEventListener('click', generateCaptcha);

export function registerPage() {
    showView(section);
    generateCaptcha();
}

let captcha;
function generateCaptcha() {

    // Clear old input
    document.getElementById("submit").value = "";

    // Access the element to store
    // the generated captcha
    captcha = document.getElementById("captcha-image");
    let uniquechar = "";

    const randomchar =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    // Generate captcha for length of
    // 5 with random character
    for (let i = 1; i < 5; i++) {
        uniquechar += randomchar.charAt(
            Math.random() * randomchar.length)
    }

    // Store generated input
    captcha.innerHTML = uniquechar;
}

async function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(form);

    const email = formData.get('email');
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const password = formData.get('password');

    const captchaMessage = document
        .getElementById("submit").value;

    if (captchaMessage != captcha.innerHTML) {
        document.getElementById("register-error-message").textContent = "Wrong Captcha! Please try again!";
        return;
    }

    await register(email, firstName, lastName, password);
    form.reset();
    updateNav();

    const emailElement = document.getElementById('re-confirm-email');
    const nameElement = document.getElementById('re-confirm-name');

    emailElement.textContent = email;
    nameElement.textContent = firstName;
}

async function register(email, firstName, lastName, password) {
    let messageElement = document.getElementById("register-error-message");
    // Check if any of the input parameters are empty
    if (!email || !firstName || !lastName || !password) {
        messageElement.textContent = 'Please fill in all the fields.';
        return;
    }

    // Validate email format using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        messageElement.textContent = 'Please enter a valid email address.';
        return;
    }

    // Check password length
    if (password.length < 6) {
        messageElement.textContent = 'Password should be at least 6 characters long.';
        return;
    }

    try {
        const res = await fetch('http://localhost:3030/api/users/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, firstName, lastName, password })
        });

        console.log(res);
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
        }

        const user = await res.json();
        confirmPage();
        // localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
        alert(err.message);
    }
}