(() => {
  // const apiUrl = 'https://projet-voltaire-bot.vercel.app';
  const apiUrl = 'http://localhost:5000';

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const processSentence = () => {
    const sentence = document.querySelector('.sentence').textContent;
    console.log(`[Projet Voltaire Bot] Détection d'une nouvelle phrase : ${sentence}`);

    fetch(apiUrl + '/fix-sentence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sentence }),
    })
      .then((response) => {
        // if the response from the server is more than 10s, vercel will reply with a 504
        if (response.status !== 200 || !response.ok) {
          return processSentence();
        }
        return response.json();
      })
      .then(async ({
        word_to_click, sentence
      }) => {
        console.log('[Projet Voltaire Bot] Correction de la phrase :', sentence);
        console.log('[Projet Voltaire Bot] Mot à cliquer :', word_to_click);
        const element = Array.from(document.querySelectorAll('.pointAndClickSpan')).find((el) => el.textContent === word_to_click || el.textContent.includes(word_to_click));
        element.click();

        document.querySelector('.nextButton').click();
        await wait(500);
        processSentence();
      })
      .catch((error) => {
        console.error('[Projet Voltaire Bot] Erreur lors de la correction de la phrase :', error);
        if (error.message === 'Failed to fetch') {
          processSentence();
        }
      });
  }

  const handleIntensiveTrainingPopup = async () => {
    if (document.querySelector('.exitButton.primaryButton')?.style?.display === 'none') {
      document.querySelector('.understoodButton').click();
    }
    await wait(500);
    fetch(apiUrl + '/intensive-training', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rule: new DOMParser().parseFromString(document.querySelector('.rule-details-description').innerHTML.split('<br>')[0], 'text/html').body.textContent,
        sentences: Array.from(document.querySelectorAll('.intensiveQuestion .sentence')).map((el) => el.textContent),
      }),
    }).then((response) => {
      if (response.status !== 200 || !response.ok) {
        return handleIntensiveTrainingPopup();
      }
      return response.json();
    }).then(async (res) => {
      for (let i = 0; i < res.length; i++) {
        const correct = res[i].correct;
        document.querySelectorAll('.intensiveQuestion')[i].querySelector(`.button${correct ? 'Ok' : 'Ko'}`).click();
      }
      await wait(500);
      document.querySelector('.exitButton.primaryButton').click();
      await wait(500);
      run();
    }).catch((error) => {
      console.error('[Projet Voltaire Bot] Erreur lors de la correction de l\'entraînement intensif :', error);
      if (error.message === 'Failed to fetch') {
        handleIntensiveTrainingPopup();
      }
    });
  }
  const run = () => {
    if (document.querySelector('.intensiveQuestion') && document.querySelector('.intensiveTraining')) {
      handleIntensiveTrainingPopup();
    } else if (document.querySelector('.sentence')) {
      processSentence();
    }
  }
  run();
})();