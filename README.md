# projet-voltaire-bot

Une API en Python pour "botter" le projet Voltaire en utilisant GPT-4.

> [!NOTE]
> Ce projet est à but purement éducatif, je ne suis pas responsable de l'utilisation que vous en faites. Si vous vous faites choper en train de tricher c'est pas ma faute mdrrr 🫵🫵😂😂

## Taux de réussite

| Entraînement | Fonctionne ? |
|--------------|-----------------------|
| Orthographe  | À tester complètement |
| Expression   | Oui nickel |

## Installer le serveur en local

1. Installez Python (**pensez à cocher "Add python.exe to PATH"**)
2. Installez les dépendances avec `pip install -r requirements.txt`
3. Lancez le serveur avec `flask --app main run`
4. C'est bon

## Installer l'extension

Première chose téléchargez le repo en cliquant sur le bouton vert "Code" puis "Download ZIP". Ensuite, extrayez le fichier ZIP.

### Chrome et navigateurs basés sur Chromium

1. Ouvrez chrome://extensions/
2. Activez le mode développeur
3. Cliquez sur "Charger l'extension non empaquetée"
4. Sélectionnez le dossier `extension` de ce repo
5. Pour que l'extension s'active, rendez vous sur une page du projet Voltaire, et cliquez sur l'icône de l'extension en haut à droite de votre navigateur.

### Firefox

1. Ouvrez about:debugging
2. Cliquez sur "This Firefox"
3. Cliquez sur "Load Temporary Add-on"
4. Sélectionnez le fichier `manifest.json` du dossier `extension` de ce repo
5. Pour que l'extension s'active, rendez vous sur une page du projet Voltaire, et cliquez sur l'icône de l'extension en haut à droite de votre navigateur.