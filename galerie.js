// ===== Supabase Config =====
const SUPABASE_URL = 'https://yoyulkqsyqqyxwcuafic.supabase.co';
const SUPABASE_KEY = 'sb_publishable_S6mlyqj3uDRd9xLi7h5STg_OFlmMI90';

const btnAddMedia = document.getElementById('btnAddMedia');
const hiddenInput = document.getElementById('hiddenFileInput');
const galleryGrid = document.getElementById('galleryGrid');

// ===== Charger les médias depuis Supabase =====
async function loadGalerie() {
    galleryGrid.innerHTML = '<p style="color:#9ca3af;text-align:center;grid-column:1/-1;">Chargement...</p>';
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/galerie?order=created_at.desc`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        const items = await res.json();
        galleryGrid.innerHTML = '';
        if (items.length === 0) {
            galleryGrid.innerHTML = '<p style="color:#9ca3af;text-align:center;grid-column:1/-1;">Aucun média pour l\'instant. Ajoutez votre première photo !</p>';
            return;
        }
        items.forEach(item => addCard(item));
    } catch (e) {
        galleryGrid.innerHTML = '<p style="color:red;text-align:center;grid-column:1/-1;">Erreur de chargement.</p>';
    }
}

// ===== Créer une carte média =====
function addCard(item) {
    const card = document.createElement('div');
    card.className = 'media-card';
    card.dataset.id = item.id;

    let mediaHtml = item.type === 'video'
        ? `<div class="video-placeholder"><i class="fas fa-play-circle"></i></div>`
        : `<img src="${item.url_photo}" alt="${item.titre}">`;

    card.innerHTML = `
        ${mediaHtml}
        <div class="media-info">
            <span>${item.titre || 'Sans titre'}</span>
            <button class="btn-delete" onclick="deleteMedia('${item.id}', '${item.fichier_path}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    galleryGrid.appendChild(card);
}

// ===== Upload fichier =====
btnAddMedia.addEventListener('click', () => hiddenInput.click());

hiddenInput.addEventListener('change', async function () {
    if (!this.files || !this.files[0]) return;
    const file = this.files[0];
    const titre = prompt("Donnez un titre à ce média :", "Nouveau souvenir");
    if (!titre) return;

    const isVideo = file.type.startsWith('video/');
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = `public/${fileName}`;

    // Afficher un état de chargement
    const loadingCard = document.createElement('div');
    loadingCard.className = 'media-card';
    loadingCard.innerHTML = `
        <div style="height:180px;background:#e5e7eb;display:flex;align-items:center;justify-content:center;">
            <i class="fas fa-spinner fa-spin" style="font-size:30px;color:#1e3a8a;"></i>
        </div>
        <div class="media-info"><span>Envoi en cours...</span></div>
    `;
    galleryGrid.prepend(loadingCard);

    try {
        // 1. Upload dans Supabase Storage
        const uploadRes = await fetch(
            `${SUPABASE_URL}/storage/v1/object/galerie/${filePath}`,
            {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': file.type
                },
                body: file
            }
        );
        const errorText = await uploadRes.text();
if (!uploadRes.ok) {
    throw new Error("Erreur upload Storage : " + errorText);
}

        // 2. URL publique
        const url_photo = `${SUPABASE_URL}/storage/v1/object/public/galerie/${filePath}`;

        // 3. Sauvegarder dans la table galerie
        const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/galerie`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                titre,
                url_photo,
                fichier_path: filePath,
                type: isVideo ? 'video' : 'photo'
            })
        });
        if (!dbRes.ok) throw new Error('Erreur sauvegarde base de données');
        const [newItem] = await dbRes.json();

        // 4. Remplacer la carte de chargement
        loadingCard.remove();
        galleryGrid.prepend(document.createElement('div')); // placeholder
        const tempDiv = galleryGrid.firstChild;
        galleryGrid.removeChild(tempDiv);
        addCardFirst(newItem);

    } catch (e) {
        loadingCard.remove();
        alert('Erreur : ' + e.message);
    }

    // Reset input
    this.value = '';
});

function addCardFirst(item) {
    const card = document.createElement('div');
    card.className = 'media-card';
    card.dataset.id = item.id;

    let mediaHtml = item.type === 'video'
        ? `<div class="video-placeholder"><i class="fas fa-play-circle"></i></div>`
        : `<img src="${item.url_photo}" alt="${item.titre}">`;

    card.innerHTML = `
        ${mediaHtml}
        <div class="media-info">
            <span>${item.titre || 'Sans titre'}</span>
            <button class="btn-delete" onclick="deleteMedia('${item.id}', '${item.fichier_path}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    galleryGrid.prepend(card);
}

// ===== Supprimer un média =====
async function deleteMedia(id, filePath) {
    if (!confirm('Supprimer ce média ?')) return;
    try {
        // 1. Supprimer du Storage
        await fetch(`${SUPABASE_URL}/storage/v1/object/galerie/${filePath}`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        // 2. Supprimer de la table
        await fetch(`${SUPABASE_URL}/rest/v1/galerie?id=eq.${id}`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        // 3. Retirer la carte
        document.querySelector(`.media-card[data-id="${id}"]`)?.remove();

        if (galleryGrid.children.length === 0) {
            galleryGrid.innerHTML = '<p style="color:#9ca3af;text-align:center;grid-column:1/-1;">Aucun média pour l\'instant.</p>';
        }
    } catch (e) {
        alert('Erreur suppression : ' + e.message);
    }
}

// ===== Init =====
loadGalerie();
