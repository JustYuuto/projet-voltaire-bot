# Projet Voltaire Bot

Une API en Python pour "botter" le projet Voltaire en utilisant GPT-4.

> [!NOTE]
> Ce projet est à but purement éducatif, je ne suis pas responsable de l'utilisation que vous en faites. Si vous vous faites choper en train de tricher c'est pas ma faute mdrrr 🫵🫵😂😂

## Taux de réussite

| Entraînement | Fonctionne ?          |
|--------------|-----------------------|
| Orthographe  | À tester complètement |
| Expression   | Oui nickel            |

## Utilisation

Première chose, télécharger le repo : https://github.com/JustYuuto/projet-voltaire-bot/archive/refs/heads/master.zip

Pour utiliser le bot, il suffit de [lancer le serveur en local](#installer-le-serveur-en-local) et d'installer [l'extension dans votre navigateur](#installer-lextension).

> [!WARNING]
> **Attention :** L'extension ne fonctionne qu'avec cette interface du projet Voltaire : 
> ![Interface du projet Voltaire](/screenshot.png)

### Installer le serveur en local

1. Installez Python (**pensez à cocher "Add python.exe to PATH"**).<br/>
   Je recommande d'utiliser Python 3.12 pour éviter les erreurs de compatibilité avec certaines dépendances.
2. Allez dans le dossier de ce repo
3. **Sur Windows :** Lancez le script `start.bat` pour installer les dépendances et lancer le serveur.<br/>
   **Sur Linux/macOS :** Lancez les commandes suivantes dans un terminal :
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   flask --app main run
   ```
4. Si tout s'est bien passé, vous devriez voir un message du type `Running on http://....`
5. Vous pouvez maintenant [installer l'extension](#installer-lextension).

### Installer l'extension

#### Chrome, Edge, Opera, Brave, Vivaldi, etc.

1. Ouvrez chrome://extensions/
2. Activez le mode développeur
3. Cliquez sur "Charger l'extension non empaquetée"
4. Sélectionnez le dossier `extension` de ce repo
5. Pour que l'extension s'active, rendez vous sur une page du projet Voltaire, et cliquez sur l'icône de l'extension en haut à droite de votre navigateur.

#### Firefox

1. Ouvrez about:debugging
2. Cliquez sur "This Firefox"
3. Cliquez sur "Load Temporary Add-on"
4. Sélectionnez le fichier `manifest.json` du dossier `extension` de ce repo
5. Pour que l'extension s'active, rendez vous sur une page du projet Voltaire, et cliquez sur l'icône de l'extension en haut à droite de votre navigateur.
