# Projet Voltaire Bot

Une API en Python pour "botter" le projet Voltaire en utilisant GPT-4. Etant donné l'utilisation de GPT-4, il est possible que le bot clique sur des réponses fausses, néanmoins cela reste très rare.

> [!NOTE]
> Ce projet est à but purement éducatif, je ne suis pas responsable de l'utilisation que vous en faites. Si vous vous faites choper en train de tricher c'est pas ma faute mdrrr 🫵🫵😂😂

## Utilisation

Première chose, télécharger le repo : https://github.com/JustYuuto/projet-voltaire-bot/archive/refs/heads/master.zip

Pour utiliser le bot, il suffit de [lancer le serveur en local](#installer-le-serveur-en-local) et d'installer [l'extension dans votre navigateur](#installer-lextension).

> [!WARNING]
> **Attention :** L'extension ne fonctionne qu'avec cette interface du projet Voltaire. Si vous utilisez une autre interface, l'extension **ne FONCTIONNERA PAS**. Si vous vous y connaissez en JS/Python, libre à vous de modifier le code pour qu'il fonctionne avec d'autres interfaces.
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

## Taux de réussite

<table>
   <thead>
      <tr>
         <th>Entraînement</th>
         <th>Fonctionne ?</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>Orthographe</td>
         <td>
            <ul>
               <li>Entrainement intensif : marche très bien</li>
               <li>Clic sur les fautes : marche mais fait des fautes des fois</li>
               <li>Mot à remplir avec l'audio : ✅</li>
            </ul>
         </td>
      </tr>
      <tr>
         <td>Expression</td>
         <td>Oui nickel</td>
      </tr>
   </tbody>
</table>
