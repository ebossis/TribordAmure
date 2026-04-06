// ===== Supabase Config =====
const SUPABASE_URL = 'https://yoyulkqsyqqyxwcuafic.supabase.co';
const SUPABASE_KEY = 'sb_publishable_S6mlyqj3uDRd9xLi7h5STg_OFlmMI90';

async function supabase(method, table, body = null, id = null) {
    const url = `${SUPABASE_URL}/rest/v1/${table}${id ? `?id=eq.${id}` : ''}`;
    const res = await fetch(url, {
        method,
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': method === 'POST' ? 'return=representation' : ''
        },
        body: body ? JSON.stringify(body) : null
    });
    if (!res.ok) throw new Error(await res.text());
    if (method === "DELETE" || method === "PATCH") return null;
    return res.json();
}

// ===== Éléments DOM =====
const tbody = document.getElementById('membresTableBody');
const searchInput = document.getElementById('searchInput');
const btnNouvel = document.getElementById('btnNouvelAdherent');
const modal = document.getElementById('modalMembre');
const modalTitle = document.getElementById('modalTitle');
const formMembre = document.getElementById('formMembre');
const btnAnnuler = document.getElementById('btnAnnuler');

let membres = [];
let editingId = null;

// ===== Chargement des membres =====
async function loadMembres() {
    try {
        membres = await supabase('GET', 'membres?order=created_at.desc');
        renderTable(membres);
    } catch (e) {
        console.error('Erreur chargement membres:', e);
    }
}

// ===== Affichage du tableau =====
function renderTable(data) {
    tbody.innerHTML = '';
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#9ca3af;padding:30px;">Aucun adhérent trouvé</td></tr>';
        return;
    }
    data.forEach(m => {
        const tr = document.createElement('tr');
        const badgeClass = m.statut === 'À jour' ? 'valid' : 'pending';
        tr.innerHTML = `
            <td><strong>${m.nom}</strong></td>
            <td>${m.email || '-'}</td>
            <td>${m.date_adhesion ? new Date(m.date_adhesion).toLocaleDateString('fr-FR') : '-'}</td>
            <td><span class="badge ${badgeClass}">${m.statut}</span></td>
            <td>
                <button class="btn-action btn-edit" onclick="openEdit('${m.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-del" onclick="deleteMembre('${m.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ===== Recherche =====
searchInput && searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    const filtered = membres.filter(m =>
        m.nom.toLowerCase().includes(q) || (m.email || '').toLowerCase().includes(q)
    );
    renderTable(filtered);
});

// ===== Ouvrir modal ajout =====
btnNouvel && btnNouvel.addEventListener('click', () => {
    editingId = null;
    modalTitle.textContent = 'Nouvel adhérent';
    formMembre.reset();
    modal.style.display = 'flex';
});

// ===== Ouvrir modal édition =====
function openEdit(id) {
    const m = membres.find(x => x.id === id);
    if (!m) return;
    editingId = id;
    modalTitle.textContent = 'Modifier l\'adhérent';
    document.getElementById('inputNom').value = m.nom || '';
    document.getElementById('inputEmail').value = m.email || '';
    document.getElementById('inputDate').value = m.date_adhesion || '';
    document.getElementById('inputStatut').value = m.statut || 'À jour';
    modal.style.display = 'flex';
}

// ===== Fermer modal =====
btnAnnuler && btnAnnuler.addEventListener('click', () => {
    modal.style.display = 'none';
});

// ===== Sauvegarder =====
formMembre && formMembre.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        nom: document.getElementById('inputNom').value,
        email: document.getElementById('inputEmail').value,
        date_adhesion: document.getElementById('inputDate').value || null,
        statut: document.getElementById('inputStatut').value
    };
    try {
        if (editingId) {
            await supabase('PATCH', `membres?id=eq.${editingId}`, data);
        } else {
            await supabase('POST', 'membres', data);
        }
        modal.style.display = 'none';
        await loadMembres();
    } catch (e) {
        alert('Erreur lors de la sauvegarde : ' + e.message);
    }
});

// ===== Supprimer =====
async function deleteMembre(id) {
    if (!confirm('Supprimer cet adhérent ?')) return;
    try {
        await supabase('DELETE', `membres?id=eq.${id}`);
        await loadMembres();
    } catch (e) {
        alert('Erreur suppression : ' + e.message);
    }
}

// ===== Init =====
loadMembres();
