// Au chargement → remplir si mémorisé
window.addEventListener('DOMContentLoaded', () => {
    const savedEmail = localStorage.getItem('remember_email');
    const remember = localStorage.getItem('remember_me') === 'true';

    if (remember && savedEmail) {
        document.getElementById('email').value = savedEmail;
        document.querySelector('.remember-me input').checked = true;
    }
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.querySelector('.remember-me input').checked;

    if (email === "admin@tribord.nc" && password === "lagon2026") {

        if (remember) {
            localStorage.setItem('remember_email', email);
            localStorage.setItem('remember_me', true);
        } else {
            localStorage.removeItem('remember_email');
            localStorage.removeItem('remember_me');
        }

        window.location.href = 'admin.html';

    } else {
        alert("Oups ! Identifiants incorrects. Demandez à Erwan ou réessayez !");
    }
});
