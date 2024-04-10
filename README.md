# projet-voltaire-bot

Une API en Python pour "botter" le projet Voltaire en utilisant GPT-4.

## Utilisation

Pour utiliser le bot vous pouvez installer l'extension pour navigateur, elle utilise l'API de ce repo.

Si vous souhaitez utiliser l'API directement, vous pouvez le faire en faisant une requête POST à `https://projet-voltaire-bot.vercel.app/fix-sentence`. Le corps de la requête doit être un JSON avec le champ `sentence` qui est la phrase à corriger.

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