<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ouvrir BikeApp 🚴</title>

  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500&display=swap"
    rel="stylesheet">

  <style>
    :root {
      /* Palette Orange BikeApp */
      --primary: #FF6B00;
      /* Orange vif, principal */
      --primary-dark: #E66000;
      /* Orange plus sombre pour le hover */
      --bg: #121212;
      /* Fond sombre moderne */
      --text-muted: #A0A0A0;
      /* Texte secondaire */
    }

    body {
      margin: 0;
      font-family: 'Inter', sans-serif;
      /* Police de texte principale */
      background: var(--bg);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      overflow: hidden;
    }

    /* Animation de fond : une lueur orange douce et floue */
    .bg-glow {
      position: absolute;
      width: 400px;
      height: 400px;
      background: var(--primary);
      filter: blur(150px);
      opacity: 0.2;
      /* Très subtil */
      z-index: -1;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .card {
      max-width: 380px;
      width: 90%;
      /* Effet Glassmorphism subtil avec teinte orange très légère */
      background: rgba(255, 107, 0, 0.03);
      padding: 50px 30px;
      border-radius: 28px;
      border: 1px solid rgba(255, 107, 0, 0.15);
      /* Bordure orange très fine */
      backdrop-filter: blur(20px);
      text-align: center;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
    }

    /* Icône animée avec la police Poppins pour un look plus "titre" */
    .icon-container {
      font-size: 60px;
      margin-bottom: 25px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
    }

    @keyframes bounce {

      0%,
      100% {
        transform: translateY(0);
      }

      50% {
        transform: translateY(-12px);
      }
    }

    h1 {
      font-family: 'Poppins', sans-serif;
      /* Police de titre pour un look sport */
      font-size: 26px;
      margin: 0 0 15px;
      font-weight: 700;
      color: white;
    }

    p {
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 35px;
      /* margin: 2em 0; */
      font-size: 15px;
    }

    .btn-group {
      display: flex;
      flex-direction: column;
      gap: 15px;
      opacity: 0;
      transform: translateY(15px);
      transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
      /* Animation fluide */
    }

    .btn-group.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .store-link img {
      height: 54px;
      transition: transform 0.2s ease-out;
    }

    .store-link:hover img {
      transform: scale(1.04);
    }

    .web-link {
      margin-top: 25px;
      display: inline-block;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      border-bottom: 1px solid transparent;
      transition: all 0.3s;
    }

    .web-link:hover {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }

    /* Loader personnalisé en orange */
    .loader {
      width: 24px;
      height: 24px;
      border: 2px solid rgba(255, 107, 0, 0.2);
      border-top-color: var(--primary);
      /* L'orange BikeApp */
      border-radius: 50%;
      display: inline-block;
      animation: spin 0.9s linear infinite;
      margin-top: 15px;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  </style>
</head>

<body>

  <div class="bg-glow"></div>

  <div class="card">

    <img class="icon-container" src="{{ asset('images/play_store_512.png') }}" alt="BikeApp Logo"
      style="border-radius: 5px; width: 120px; height: 120px;">

    <h1 id="status-title">On arrive...</h1>
    <p id="status-text">Nous tentons de lancer BikeApp sur votre appareil.
      Si rien ne se passe, pas de panique ! Nous allons vous rediriger vers la page de téléchargement.
    </p>
    <div id="loading-spinner" class="loader"></div>

    <div id="fallback" class="btn-group">

      <a href="https://apps.apple.com/app/idXXXXXXXX" class="store-link" id="ios-link">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/40/Download_on_the_App_Store_Badge_FRCA_RGB_blk.svg"
          alt="Télécharger sur l'App Store">
      </a>

      <a href="https://play.google.com/store/apps/details?id=com.bikeapp.mobile" class="store-link" id="android-link">
        <img
          src="https://raw.githubusercontent.com/pioug/google-play-badges/84247f16ddb0ebd9cfc2459085c2b6c7a43f3237/svg/fr.svg"
          alt="Télécharger sur Google Play">
      </a>
    </div>
  </div>

  <script>
    // Détection de la plateforme (iOS, Android, Autre)
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /android/i.test(userAgent);

    window.onload = function () {
      // 1. Essai d'ouverture via le Deep Link custom
      // À remplacer par ton schéma d'URL réel si différent
      window.location.href = '{{ $deepLink }}';

      // 2. Fallback intelligent après 2.5 secondes
      setTimeout(function () {
        // Cacher le loader
        document.getElementById('loading-spinner').style.display = 'none';

        // Mettre à jour le texte
        document.getElementById('status-title').innerText = "Oups !";
        document.getElementById('status-text').innerText = "Impossible d'ouvrir l'application automatiquement.";

        // Afficher les boutons de store
        const fallback = document.getElementById('fallback');
        fallback.classList.add('visible');

        // Ne montrer que le store pertinent
        if (isIOS) {
          document.getElementById('android-link').style.display = 'none';
        } else if (isAndroid) {
          document.getElementById('ios-link').style.display = 'none';
        }
        // Si c'est un PC, on montre les deux
      }, 2500);
    };
  </script>

</body>

</html>