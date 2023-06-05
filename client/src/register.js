import { showView, updateNav} from './utils.js';

const section = document.querySelector('#form-register');
const form = section.querySelector('form');
form.addEventListener('submit', onSubmit);

export function registerPage() {
    showView(section);
}

async function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(form);

    const email = formData.get('email');
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const password = formData.get('password');

    await register(email, firstName, lastName, password);
    form.reset();
    updateNav();

    // TODO: Regirect
}

async function register(email, firstName, lastName, password) {
    // TODO Valldation

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
        localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
        alert(err.message);
    }
}