const pages = [...document.querySelectorAll(".page")];
const closedDiary = document.getElementById("closedDiary");
const bookShell = document.getElementById("bookShell");
const pageNow = document.getElementById("pageNow");
const pageTotal = document.getElementById("pageTotal");
const nextPage = document.getElementById("nextPage");
const prevPage = document.getElementById("prevPage");
const trackName = document.getElementById("trackName");

// 🎵 AUDIO
const songs = [
  document.getElementById("song1"),
  document.getElementById("song2"),
  document.getElementById("song3"),
];

let currentSong = 0;
let musicPlaying = false;

let currentPage = 0;
let audioContext;
let musicGain;

pageTotal.textContent = pages.length;

// ===============================
// 📖 PAGE FLIP SOUND
// ===============================
function ensureAudio() {
  if (audioContext) return;

  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  musicGain = audioContext.createGain();

  const volumeSlider = document.getElementById("volumeControl");

  musicGain.gain.value = Number(volumeSlider.value);

  musicGain.connect(audioContext.destination);
}

function pageSound() {
  ensureAudio();

  const noiseBuffer = audioContext.createBuffer(
    1,
    audioContext.sampleRate * 0.15,
    audioContext.sampleRate,
  );

  const data = noiseBuffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }

  const source = audioContext.createBufferSource();
  const gain = audioContext.createGain();

  source.buffer = noiseBuffer;

  gain.gain.setValueAtTime(0.03, audioContext.currentTime);

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.15,
  );

  source.connect(gain);
  gain.connect(audioContext.destination);

  source.start();
}

// ===============================
// 🎵 MUSIC SYSTEM
// ===============================

// default volume
songs.forEach((song) => {
  song.volume = 0.35;
});

function playSong(index) {
  songs.forEach((song) => {
    song.pause();
    song.currentTime = 0;
  });

  songs[index]
    .play()
    .then(() => {
      musicPlaying = true;
      document.getElementById("musicToggle").innerText = "⏸";
    })
    .catch(() => {
      console.log("Autoplay blocked");
    });

  const names = ["Pastel Lullaby", "Moonlight Butter", "Soft Memories"];

  trackName.innerText = names[index];
}

function nextSongAuto() {
  currentSong = (currentSong + 1) % songs.length;
  playSong(currentSong);
}

songs.forEach((song) => {
  song.addEventListener("ended", nextSongAuto);
});

// toggle music
document.getElementById("musicToggle").addEventListener("click", () => {
  if (!musicPlaying) {
    playSong(currentSong);
  } else {
    songs[currentSong].pause();
    musicPlaying = false;
    document.getElementById("musicToggle").innerText = "♪";
  }
});

// volume control
document.getElementById("volumeControl").addEventListener("input", (e) => {
  songs.forEach((song) => {
    song.volume = e.target.value;
  });
});

// ===============================
// 📖 OPEN DIARY
// ===============================
document.getElementById("openDiary").addEventListener("click", () => {
  closedDiary.classList.add("opening");

  pageSound();

  setTimeout(() => {
    closedDiary.style.display = "none";

    bookShell.classList.add("visible");

    pages[0].classList.add("active");

    // auto music start
    playSong(0);
  }, 700);
});

// ===============================
// 📖 CLOSE DIARY
// ===============================
document.getElementById("closeDiary").addEventListener("click", () => {
  pageSound();

  bookShell.classList.remove("visible");

  closedDiary.style.display = "grid";

  closedDiary.classList.remove("opening");

  pages[currentPage].classList.remove("active");

  currentPage = 0;

  pages[0].classList.add("active");

  pageNow.textContent = 1;

  // stop music
  songs.forEach((song) => {
    song.pause();
    song.currentTime = 0;
  });

  musicPlaying = false;

  document.getElementById("musicToggle").innerText = "♪";
});

// ===============================
// 📖 PAGE SHOW
// ===============================
function showPage(index, direction = 1) {
  if (index < 0 || index >= pages.length || index === currentPage) return;

  const oldPage = pages[currentPage];

  oldPage.classList.add("flipping-out");

  pageSound();

  setTimeout(() => {
    oldPage.classList.remove("active", "flipping-out");

    pages[index].style.transformOrigin =
      direction > 0 ? "left center" : "right center";

    pages[index].classList.add("active");

    currentPage = index;

    pageNow.textContent = currentPage + 1;
  }, 260);
}

// ===============================
// ⬅️➡️ BUTTONS
// ===============================
nextPage.addEventListener("click", () => {
  showPage(currentPage + 1, 1);
});

prevPage.addEventListener("click", () => {
  showPage(currentPage - 1, -1);
});

// keyboard controls
document.addEventListener("keydown", (event) => {
  if (!bookShell.classList.contains("visible")) return;

  if (event.key === "ArrowRight") {
    showPage(currentPage + 1, 1);
  }

  if (event.key === "ArrowLeft") {
    showPage(currentPage - 1, -1);
  }
});

// ===============================
// ✨ MAGIC BUTTON
// ===============================
const comforts = [
  "You are softer than the storms around you 🌙",
  "Butter hearts deserve gentle nights 🪄",
  "Even tired stars still glow ✨",
  "Breathe slowly… you're safe here 🤍",
  "Moonlight still waits for you 🌌",
];

const magicButton = document.getElementById("magicButton");

const comfortMessage = document.getElementById("comfortMessage");

if (magicButton) {
  magicButton.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * comforts.length);

    comfortMessage.textContent = comforts[randomIndex];

    pageSound();
  });
}

// ===============================
// 🎤 VOICE NOTES
// ===============================
const voiceCards = document.querySelectorAll(".voice-card");

const voicePlayer = document.getElementById("voicePlayer");

voiceCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    const noteText = card.getAttribute("data-note");

    voicePlayer.textContent = noteText;

    currentSong = index;

    playSong(currentSong);

    pageSound();
  });
});

// ===============================
// ⏳ COUNTDOWN
// ===============================
function updateCountdown() {
  const now = new Date();

  let target = new Date(now.getFullYear(), 8, 13);

  if (now > target) {
    target = new Date(now.getFullYear() + 1, 8, 13);
  }

  const diff = target - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");

  document.getElementById("hours").textContent = String(hours).padStart(2, "0");

  document.getElementById("minutes").textContent = String(minutes).padStart(
    2,
    "0",
  );

  document.getElementById("seconds").textContent = String(seconds).padStart(
    2,
    "0",
  );
}

updateCountdown();

setInterval(updateCountdown, 1000);

// ===============================
// 🎮 MINI GAME
// ===============================
const snackGameCanvas = document.getElementById("snackGame");

const startGameBtn = document.getElementById("startGame");

if (snackGameCanvas) {
  const ctx = snackGameCanvas.getContext("2d");

  let gameRunning = false;

  class Player {
    constructor() {
      this.x = snackGameCanvas.width / 2 - 30;
      this.y = snackGameCanvas.height - 70;
      this.width = 60;
      this.height = 40;
      this.speed = 18;
    }

    draw() {
      ctx.font = "38px Arial";
      ctx.fillText("🐻", this.x, this.y);
    }
  }

  class Item {
    constructor(type) {
      this.x = Math.random() * (snackGameCanvas.width - 30);

      this.y = -30;

      this.type = type;

      this.speed = 2 + Math.random() * 2;
    }

    update() {
      this.y += this.speed;
    }

    draw() {
      ctx.font = "28px Arial";

      ctx.fillText(this.type === "icecream" ? "🍦" : "☁️", this.x, this.y);
    }
  }

  const player = new Player();

  let items = [];
  let score = 0;
  let gameTime = 30;

  function startGame() {
    gameRunning = true;

    items = [];

    score = 0;

    gameTime = 30;

    startGameBtn.disabled = true;

    const gameLoop = setInterval(() => {
      if (!gameRunning) {
        clearInterval(gameLoop);

        ctx.fillStyle = "rgba(0,0,0,0.5)";

        ctx.fillRect(0, 0, snackGameCanvas.width, snackGameCanvas.height);

        ctx.fillStyle = "#fff";

        ctx.font = "28px Arial";

        ctx.fillText("Game Over 🌙", 170, 150);

        ctx.fillText(`Score : ${score}`, 190, 200);

        startGameBtn.disabled = false;

        return;
      }

      ctx.clearRect(0, 0, snackGameCanvas.width, snackGameCanvas.height);

      if (Math.random() < 0.05) {
        items.push(new Item(Math.random() < 0.7 ? "icecream" : "cloud"));
      }

      player.draw();

      items = items.filter((item) => {
        item.update();

        item.draw();

        if (
          item.x > player.x - 20 &&
          item.x < player.x + 40 &&
          item.y > player.y - 30
        ) {
          if (item.type === "icecream") {
            score++;
          } else {
            score = Math.max(0, score - 1);
          }

          return false;
        }

        return item.y < snackGameCanvas.height;
      });

      ctx.fillStyle = "#6f5264";

      ctx.font = "18px Arial";

      ctx.fillText(`Score : ${score}`, 20, 30);

      ctx.fillText(`Time : ${gameTime}`, 20, 60);

      gameTime -= 0.05;

      if (gameTime <= 0) {
        gameRunning = false;
      }
    }, 50);
  }

  startGameBtn.addEventListener("click", startGame);

  // keyboard move
  document.addEventListener("keydown", (e) => {
    if (!gameRunning) return;

    if (e.key === "ArrowLeft") {
      player.x -= player.speed;
    }

    if (e.key === "ArrowRight") {
      player.x += player.speed;
    }
  });

  // mobile touch
  snackGameCanvas.addEventListener("touchmove", (e) => {
    if (!gameRunning) return;

    const rect = snackGameCanvas.getBoundingClientRect();

    player.x = e.touches[0].clientX - rect.left - 20;
  });
}
