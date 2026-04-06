// --- 1. Ajouter un VRAI adhérent dans le tableau ---
document.getElementById('btnAddMember').addEventListener('click', function() {
    const nom = prompt("Nom du nouvel adhérent :");
    if (nom && nom.trim() !== "") {
        const table = document.getElementById('membersTable').getElementsByTagName('tbody')[0];
        const nouvelleLigne = table.insertRow();

        // On remplit les cellules (Nom, Email, Date, Statut, Actions)
        nouvelleLigne.innerHTML = `
            <td><strong>${nom}</strong></td>
            <td>contact@asso.nc</td>
            <td>${new Date().toLocaleDateString('fr-FR')}</td>
            <td><span class="badge valid">À jour</span></td>
            <td>
                <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        alert(nom + " a été ajouté sur le pont !");
    }
});

// --- 2. Gérer les clics dans le tableau (Modif, Suppr, Statut) ---
document.getElementById('membersTable').addEventListener('click', function(e) {
    const cible = e.target;

    // A. CHANGER LE STATUT (clic sur le badge)
    if (cible.classList.contains('badge')) {
        if (cible.innerText === "À jour") {
            cible.innerText = "Pas à jour";
            cible.classList.replace('valid', 'expired');
        } else if (cible.innerText === "Pas à jour") {
            cible.innerText = "À jour";
            cible.classList.replace('expired', 'valid');
        }
        return; // On s'arrête là pour ce clic
    }

    // B. MODIFIER LE NOM (Crayon)
    const editBtn = cible.closest('.edit');
    if (editBtn) {
        const ligne = editBtn.closest('tr');
        const celluleNom = ligne.cells[0];
        const ancienNom = celluleNom.textContent;
        const nouveauNom = prompt("Modifier le nom :", ancienNom);
        if (nouveauNom) celluleNom.innerHTML = "<strong>" + nouveauNom + "</strong>";
    }

    // C. SUPPRIMER (Poubelle)
    const deleteBtn = cible.closest('.delete');
    if (deleteBtn) {
        if (confirm("Supprimer cet adhérent ?")) {
            deleteBtn.closest('tr').remove();
        }
    }
});