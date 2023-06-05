import { loginPage } from './login.js';
import { registerPage } from './register.js';
import { updateNav } from './utils.js'; 

const routes = {
    '/login': loginPage,
    '/logout': logout,
    '/register': registerPage,
};

document.querySelector('.header').addEventListener('click', onNavigate);

function onNavigate(event) {
    if (event.target.tagName == 'A' && event.target.href) {
        event.preventDefault();
        
        const url = new URL(event.target.href);
        const view = routes[url.pathname];

        if (typeof view == 'function') {
            view();
        }
    }
}

function logout() {
    localStorage.removeItem('user');
    updateNav();

    registerPage();
}

updateNav();
registerPage();