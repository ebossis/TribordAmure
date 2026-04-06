document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simulation pour tes tests (tu donneras ça à Erwan plus tard)
    if (email === "admin@tribord.nc" && password === "lagon2026") {
        window.location.href = 'admin.html';
    } else {
        alert("Oups ! Identifiants incorrects. Demandez à Erwan ou réessayez !");
    }
});