document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // On récupère le nom tapé
    const nouveauNom = document.getElementById('adminName').value;
    
    // On change le nom dans la barre latérale pour la démo
    document.getElementById('displayAdminName').innerText = nouveauNom;
    
    alert("Paramètres mis à jour ! Le bureau est paré, Amiral.");
});