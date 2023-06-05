import { showView, updateNav } from './utils.js';
import { registerPage } from './register.js';

const section = document.querySelector('#form-update');
const form = section.querySelector('form');

const deleteButton = document.getElementById('delete-button');

form.addEventListener('submit', onSubmit);
deleteButton.addEventListener('click', del);

export function updatePage() {
    showView(section);
    readInformation();
}

async function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(form);

    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');

    await update(firstName, lastName);
}

async function update(firstName, lastName) {
    let messageElement = document.getElementById("update-error-message");
    let messageSuccessElement = document.getElementById("update-success-message");
    // Check if any of the input parameters are empty
    if (!firstName || !lastName) {
        messageElement.textContent = 'Please fill in all the fields.';
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));

    const res = await fetch(`http://localhost:3030/api/users`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': user.token
        },
        body: JSON.stringify({ firstName, lastName })
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }

    messageElement.textContent = '';
    messageSuccessElement.textContent = 'Successfully updated!';
}

async function del() {
    const user = JSON.parse(localStorage.getItem('user'));

    const res = await fetch(`http://localhost:3030/api/users`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': user.token
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }

    updateNav();
    registerPage();
    localStorage.clear()
}

async function readInformation() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));

        const res = await fetch(`http://localhost:3030/api/users`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': user.token
            },
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
        }

        const data = await res.json();

        const fnameInput = document.getElementById('first-name-update');
        const lnameInput = document.getElementById('last-name-update');
        const emailBox = document.getElementById('email-box');

        fnameInput.value = data.firstName
        lnameInput.value = data.lastName
        emailBox.textContent = `Your email: ${data.email}`
    } catch (err) {
        alert(err.message);
    }
}