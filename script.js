const commandLabel = document.getElementById("current-command");
const systemState = document.getElementById("system-state");
const startButton = document.getElementById("start-button");
const startNote = document.getElementById("start-note");
const commandButtons = Array.from(document.querySelectorAll(".command-button[data-command]"));
const audioVersion = "20260227-voicepack-1";
const startAcceptedAudioPath = `audio/start-accepted.wav?v=${audioVersion}`;
const commandAudioPath = new Map([
  ["Влево", `audio/vlevo-classic.wav?v=${audioVersion}`],
  ["Вправо", `audio/vpravo-classic.wav?v=${audioVersion}`],
  ["Не двигаться", `audio/ne-dvigatsya-classic.wav?v=${audioVersion}`],
  ["Лечь на пол", `audio/lech-na-pol-classic.wav?v=${audioVersion}`],
  ["Присесть", `audio/prisest-classic.wav?v=${audioVersion}`],
  ["Прыжок", `audio/jump.wav?v=${audioVersion}`],
]);
const voicePlayer = new Audio();
voicePlayer.preload = "auto";
voicePlayer.volume = 1;
voicePlayer.playsInline = true;

let currentAudioPath = "";
let hasStarted = false;

function setSystemState(text, state) {
  systemState.textContent = text;
  systemState.dataset.state = state;
}

function unlockControls() {
  commandButtons.forEach((button) => {
    button.disabled = false;
  });
}

function playAudio(audioPath) {
  if (!audioPath) {
    return;
  }

  voicePlayer.pause();

  if (currentAudioPath !== audioPath) {
    currentAudioPath = audioPath;
    voicePlayer.src = audioPath;
    voicePlayer.load();
  } else {
    voicePlayer.currentTime = 0;
  }

  voicePlayer.play().catch((error) => {
    console.error("Audio playback failed:", error);
  });
}

function speakCommand(command) {
  playAudio(commandAudioPath.get(command));
}

function setActiveCommand(command, pressedButton) {
  commandLabel.textContent = command;

  commandButtons.forEach((button) => {
    button.classList.toggle("active", button === pressedButton);
  });

  if (navigator.vibrate) {
    navigator.vibrate(25);
  }

  speakCommand(command);
}

startButton.addEventListener("click", () => {
  if (hasStarted) {
    return;
  }

  hasStarted = true;
  startButton.disabled = true;
  startButton.classList.add("used");
  startButton.setAttribute("aria-label", "Старт принят");
  startNote.textContent = "Старт принят";
  commandLabel.textContent = "Старт принят";
  setSystemState("Активно", "online");
  unlockControls();
  playAudio(startAcceptedAudioPath);

  if (navigator.vibrate) {
    navigator.vibrate([40, 20, 40]);
  }
});

commandButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!hasStarted) {
      return;
    }

    const command = button.dataset.command;
    setActiveCommand(command, button);
  });
});

setSystemState("Заблокировано", "locked");
