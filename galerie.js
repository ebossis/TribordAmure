const btnAddMedia = document.getElementById('btnAddMedia');
const hiddenInput = document.getElementById('hiddenFileInput');
const galleryGrid = document.getElementById('galleryGrid');

// 1. Déclencher la sélection de fichier
btnAddMedia.addEventListener('click', () => {
    hiddenInput.click();
});

// 2. Lire le fichier et l'afficher
hiddenInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        const file = this.files[0];
        const reader = new FileReader();
        const titre = prompt("Donnez un titre à ce média :", "Nouveau souvenir");

        reader.onload = function(e) {
            const newCard = document.createElement('div');
            newCard.className = 'media-card';

            let mediaHtml = "";
            // Si c'est une vidéo, on met une icône, sinon on affiche l'image
            if (file.type.startsWith('video/')) {
                mediaHtml = `<div class="video-placeholder"><i class="fas fa-play-circle"></i></div>`;
            } else {
                mediaHtml = `<img src="${e.target.result}" alt="Preview">`;
            }

            newCard.innerHTML = `
                ${mediaHtml}
                <div class="media-info">
                    <span>${titre}</span>
                    <button class="btn-delete"><i class="fas fa-trash"></i></button>
                </div>
            `;

            galleryGrid.prepend(newCard);
        };

        reader.readAsDataURL(file);
    }
});

// 3. Supprimer un média
galleryGrid.addEventListener('click', function(e) {
    if (e.target.closest('.btn-delete')) {
        if (confirm("Supprimer ce média ?")) {
            e.target.closest('.media-card').remove();
        }
    }
});