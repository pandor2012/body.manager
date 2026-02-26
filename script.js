const commandLabel = document.getElementById("current-command");
const buttons = Array.from(document.querySelectorAll("button[data-command]"));
const fallbackAudio = new Audio();
fallbackAudio.preload = "none";
fallbackAudio.volume = 1;

function speakCommand(command) {
  // Используем только онлайн-RU TTS (в большинстве случаев женский голос Google Translate).
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ru&q=${encodeURIComponent(command)}`;
  fallbackAudio.pause();
  fallbackAudio.currentTime = 0;
  fallbackAudio.src = url;
  fallbackAudio.play().catch(() => {});
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
