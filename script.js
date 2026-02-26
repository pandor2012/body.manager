const commandLabel = document.getElementById("current-command");
const buttons = Array.from(document.querySelectorAll("button[data-command]"));
const hasSpeechSynthesis = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
let russianVoice = null;
const fallbackAudio = new Audio();
fallbackAudio.preload = "none";
fallbackAudio.volume = 1;

function pickRussianVoice() {
  if (!hasSpeechSynthesis) {
    return;
  }

  const voices = window.speechSynthesis.getVoices();
  russianVoice =
    voices.find((voice) => voice.lang.toLowerCase().startsWith("ru")) ||
    voices.find((voice) => voice.lang.toLowerCase().includes("ru")) ||
    null;
}

function speakWithWebSpeech(command) {
  const utterance = new SpeechSynthesisUtterance(command);
  utterance.lang = "ru-RU";
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;

  if (russianVoice) {
    utterance.voice = russianVoice;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.resume();
  window.speechSynthesis.speak(utterance);
}

function speakWithFallback(command) {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ru&q=${encodeURIComponent(command)}`;
  fallbackAudio.pause();
  fallbackAudio.currentTime = 0;
  fallbackAudio.src = url;
  fallbackAudio.play().catch(() => {});
}

function speakCommand(command) {
  if (hasSpeechSynthesis && russianVoice) {
    speakWithWebSpeech(command);
    return;
  }

  speakWithFallback(command);
}

if (hasSpeechSynthesis) {
  pickRussianVoice();
  if (typeof window.speechSynthesis.addEventListener === "function") {
    window.speechSynthesis.addEventListener("voiceschanged", pickRussianVoice);
  } else {
    window.speechSynthesis.onvoiceschanged = pickRussianVoice;
  }
}

function setActiveCommand(command, pressedButton) {
  commandLabel.textContent = command;

  buttons.forEach((button) => {
    button.classList.toggle("active", button === pressedButton);
  });

  if (navigator.vibrate) {
    navigator.vibrate(25);
  }

  speakCommand(command);
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const command = button.dataset.command;
    setActiveCommand(command, button);
  });
});
