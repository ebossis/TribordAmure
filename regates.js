// --- 1. Ajouter une régate (avec la colonne Type) ---
document.getElementById('btnAddRegatta').addEventListener('click', function() {
    const nom = prompt("Nom de la régate :");
    const date = prompt("Date (ex: 12/05/2026) :");
    const type = prompt("Type de parcours (ex: Côtier !) :", "-");
    
    if (nom && date) {
        const table = document.getElementById('regatesTable').getElementsByTagName('tbody')[0];
        const nouvelleLigne = table.insertRow();
        
        // On remplit les 5 cellules
        nouvelleLigne.innerHTML = `
            <td><strong>${nom}</strong></td>
            <td>${date}</td>
            <td>${type}</td>
            <td><span class="badge valid">Ouverte</span></td>
            <td>
                <button class="action-btn delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        alert("Nouveau défi ajouté au calendrier !");
    }
});

// --- 2. Gérer le Statut (Ouverte/Fermée) et la Suppression ---
document.getElementById('regatesTable').addEventListener('click', function(e) {
    const cible = e.target;

    // Inverser Statut
    if (cible.classList.contains('badge')) {
        if (cible.innerText === "Ouverte") {
            cible.innerText = "Fermée";
            cible.classList.replace('valid', 'expired');
        } else {
            cible.innerText = "Ouverte";
            cible.classList.replace('expired', 'valid');
        }
    }

    // Supprimer
    if (cible.closest('.delete')) {
        if (confirm("Supprimer cette régate ?")) {
            cible.closest('tr').remove();
        }
    }
});