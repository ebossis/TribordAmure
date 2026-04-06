const SUPABASE_URL = 'https://yoyulkqsyqqyxwcuafic.supabase.co';
const SUPABASE_KEY = 'sb_publishable_S6mlyqj3uDRd9xLi7h5STg_OFlmMI90';

// Charger les paramètres
async function loadSettings() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/settings?id=eq.1`, {
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`
        }
    });

    const data = await res.json();

    if (data && data.length > 0) {
        document.getElementById('adminName').value = data[0].admin_name;
        document.querySelector('input[type="email"]').value = data[0].admin_email;
        document.querySelector('.switch input').checked = data[0].maintenance;
        document.getElementById('displayAdminName').innerText = data[0].admin_name;
    }
}

// Sauvegarder les paramètres
document.getElementById('settingsForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('adminName').value;
    const email = document.querySelector('input[type="email"]').value;
    const maintenance = document.querySelector('.switch input').checked;

    await fetch(`${SUPABASE_URL}/rest/v1/settings?id=eq.1`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`
        },
        body: JSON.stringify({
            admin_name: name,
            admin_email: email,
            maintenance: maintenance
        })
    });

    document.getElementById('displayAdminName').innerText = name;

    alert("Paramètres sauvegardés !");
});

// Charger au démarrage
loadSettings();
