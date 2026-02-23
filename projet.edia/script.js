// Ta configuration Firebase (déjà remplie avec tes clés !)
const firebaseConfig = {
    apiKey: "AIzaSyB6cV0HVTGEi1zn7t0OMqvLCh6TY9RpVgU",
    authDomain: "ediacontrol.firebaseapp.com",
    databaseURL: "https://ediacontrol-default-rtdb.firebaseio.com",
    projectId: "ediacontrol",
    storageBucket: "ediacontrol.firebasestorage.app",
    messagingSenderId: "213787824707",
    appId: "1:213787824707:web:8acb936a0a8012210ebaf6",
    measurementId: "G-X5VGNRN24C"
};

// Initialisation de Firebase (Syntaxe compatible navigateurs)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// --- FONCTION POUR TOI (admin.html) ---
function envoyer(commande) {
    db.ref('ordre').set({
        type: commande,
        timestamp: Date.now()
    }).then(() => {
        const logElement = document.getElementById('log');
        if (logElement) {
            logElement.innerHTML = "ORDRE ENVOYÉ : " + commande;
            logElement.style.color = "#00ff00";
        }
    }).catch((error) => {
        console.error("Erreur :", error);
    });
}

// --- LOGIQUE POUR L'AMI (index.html) ---
// On écoute la base de données
db.ref('ordre').on('value', (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    // On ignore les vieux ordres (plus de 10 secondes)
    const maintenant = Date.now();
    if (maintenant - data.timestamp > 10000) return;

    // Exécution des commandes
    if (data.type === "VIBRER") {
        if (navigator.vibrate) {
            navigator.vibrate([500, 200, 500, 200, 1000]);
        }
        alert("⚠️ ALERTE SYSTÈME : Batterie en surchauffe critique !");
    }
    
    if (data.type === "ALERTE") {
        alert("🚨 INTRUSION DÉTECTÉE : Une connexion à distance depuis 'EDIA_SERVER' est active.");
    }
    
    if (data.type === "FREEZE") {
        document.body.innerHTML = "<h1 style='color:red; text-align:center; margin-top:40%; font-family:sans-serif;'>SYSTEM CRASHED<br>Error: 0x0002503</h1>";
        setTimeout(() => {
            while(true) {} // Freeze le navigateur
        }, 500);
    }
});