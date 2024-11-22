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
        if (response.status !== 200 || !response.ok) {
          processSentence();
          return;
        }
        return response.json();
      })
      .then(async (res) => {
        if (!res) return;
        const { word_to_click } = res;
        console.log('[Projet Voltaire Bot] Correction de la phrase :', sentence);
        if (word_to_click && word_to_click !== 'null') {
          console.log('[Projet Voltaire Bot] Mot à cliquer :', word_to_click);
          console.log(Array.from(document.querySelectorAll('.pointAndClickSpan')));
          const element = Array.from(document.querySelectorAll('.pointAndClickSpan')).find((el) => {
            return el.textContent === word_to_click || //el.textContent.includes(word_to_click) ||
              // the dash is a special character in the html and not a normal dash!!
              word_to_click.split('‑').some((word) => el.textContent === word) ||
              word_to_click.split('-').some((word) => el.textContent === word) ||
              word_to_click.split('\'').some((word) => el.textContent === word);
          });
          element.click();
        } else {
          console.log('[Projet Voltaire Bot] Aucune erreur détectée dans la phrase');
          document.querySelector('.noMistakeButton').click();
        }
        await wait(500);
        document.querySelector('.nextButton').click();
        await wait(1000);
        run();
      })
      .catch((error) => {
        console.error('[Projet Voltaire Bot] Erreur lors de la correction de la phrase :', error);
        if (error.message === 'Failed to fetch')
          processSentence();
      });
  }

  const handleIntensiveTrainingPopup = async () => {
    if (document.querySelector('.exitButton')?.style?.display === 'none' && document.querySelector('.understoodButton')?.style?.display === 'none') {
      document.querySelector('.understoodButton').click();
    }
    await wait(500);
    fetch(apiUrl + '/intensive-training', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rule: new DOMParser().parseFromString(document.querySelector('.rule-details-description').innerHTML.split('<br>')[0], 'text/html').body.textContent,
        sentences: Array.from(document.querySelectorAll('.intensiveQuestion .sentence')).map((el) => el.textContent),
      }),
    }).then((response) => {
      if (response.status !== 200 || !response.ok)
        return handleIntensiveTrainingPopup();
      return response.json();
    }).then(async (res) => {
      for (let i = 0; i < res.length; i++) {
        const correct = res[i];
        document.querySelectorAll('.intensiveQuestion')[i].querySelector(`.button${correct ? 'Ok' : 'Ko'}`).click();
      }
      await wait(500);
      const message = document.querySelector('.messageContainer');
      if (message && message.style.visibility !== 'hidden' && message.textContent.includes('Il faut trois bonnes réponses')) {
        document.querySelector('.retryButton').click();
        await wait(500);
        handleIntensiveTrainingPopup();
        return;
      }
      document.querySelector('.exitButton.primaryButton').click();
      await wait(1000);
      run();
    }).catch((error) => {
      console.error('[Projet Voltaire Bot] Erreur lors de la correction de l\'entraînement intensif :', error);
      if (error.message === 'Failed to fetch') {
        handleIntensiveTrainingPopup();
      }
    });
  }
  const processVoiceExercise = async (url) => {
    if (!document.querySelector('.sentenceAudioReader')) return;
    await wait(500);
    console.log('[Projet Voltaire Bot] Exercice avec voix détecté');
    let sentence = document.querySelector('.sentenceOuter .sentence').textContent
        .replace('  ', ' {} ')
        .replace(' .', ' {}.')
        .replace('\',', '\'{},')
        .replace(' -', ' {}-')
    if (sentence.startsWith(' ')) sentence = '{} ' + sentence;
    fetch(apiUrl + '/put-word', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sentence, audio_url: url }),
    })
      .then((response) => {
        if (response.status !== 200 || !response.ok) {
          return processVoiceExercise(url);
        }
        return response.json();
      })
      .then(async ({ missing_word }) => {
        console.log('[Projet Voltaire Bot] Mot à écrire :', missing_word);
        document.querySelector('input.writingExerciseSpan').value = missing_word;
        await wait(1000);
        document.querySelector('.validateButton').click();
        await wait(500);
        document.querySelector('.nextButton').click();
        await wait(1000);
        run();
      })
      .catch((error) => {
        console.error('[Projet Voltaire Bot] Erreur lors de la correction de la phrase :', error);
        if (error.message === 'Failed to fetch') processVoiceExercise(url);
      });
  }
  const handleNearestWordQuestion = () => {
    const word = document.querySelector('.qccv-question');
    const nearest_words = Array.from(document.querySelectorAll('.qc-proposal-button')).map((el) => el.textContent);
    fetch(apiUrl + '/nearest-word', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ word: word.textContent, nearest_words }),
    })
      .then((response) => {
        if (response.status !== 200 || !response.ok) {
          return handleNearestWordQuestion();
        }
        return response.json();
      })
      .then(async ({ word }) => {
        word = word.replace('-', '‑');
        console.log('[Projet Voltaire Bot] Mot le plus proche :', word);
        const element = Array.from(document.querySelectorAll('.qc-proposal-button')).find((el) => {
          return el.textContent.toLowerCase() === word.toLowerCase() ||
            el.textContent.toLowerCase().includes(word.toLowerCase());
        });
        element.click();
        await wait(500);
        document.querySelector('.qccv-next').click();
        await wait(1000);
        run();
      })
      .catch((error) => {
        console.error('[Projet Voltaire Bot] Erreur lors de la correction de la question :', error);
        if (error.message === 'Failed to fetch') handleNearestWordQuestion();
      });
  }
  const run = async () => {
    const activityLaunchButton = Array.from(document.querySelectorAll('.activity-selector-cell-launch-button, .validation-activity-cell-launch-button'))
        .find((el) => el.style.display !== 'none');
    if (activityLaunchButton) {
      activityLaunchButton.click();
      await wait(1000);
      run();
    } else if (document.querySelector('.popupPanelLessonVideo')) {
      await wait(500);
      document.querySelector('.popupButton#btn_fermer').click();
      await wait(500);
      run();
    } else if (document.querySelector('.intensiveTraining')) {
      handleIntensiveTrainingPopup();
    } else if (document.querySelector('.sentence') && document.querySelector('.pointAndClickSpan')) {
      processSentence();
    } else if (document.querySelector('.sentenceAudioReader') && document.querySelector('.writingExerciseSpan')) {
      chrome.runtime.sendMessage({ type: 'mute_tab' });
      processVoiceExercise(document.querySelector('.sentenceAudioReader audio').src);
    } else if (document.querySelector('.qccv-question-container')) {
      handleNearestWordQuestion();
    } else if (document.querySelector('.trainingEndViewCongrate')) {
      document.querySelector('#btn_apprentissage_autres_niveaux').click();
      await wait(1000);
      run();
    }
  }
  run();
})();
