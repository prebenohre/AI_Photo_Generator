import "./style.css";
import JSConfetti from "js-confetti";

const form = document.querySelector("form");
const textArea = document.querySelector("textarea");
const jsConfetti = new JSConfetti();

form.addEventListener("submit", handleSubmit);

// Håndterer Enter-tasten i textarea
textArea.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Forhindrer ny linje i textarea
    handleSubmit(event); // Kaller handleSubmit-funksjonen
  }
});

async function handleSubmit(e) {
  e.preventDefault();
  showSpinner();
  const prompt = textArea.value;

  try {
    const response = await fetch(
      "https://ai-photo-generator-0108636d5bc8.herokuapp.com/dream",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      },
    );

    // Avbryt hvis vi får feilmelding fra serveren
    if (!response.ok) {
      const err = await response.text();
      alert(err);
      console.error(err);
      hideSpinner();
      return;
    }

    // Hent ut image-url fra serveren
    const { image } = await response.json();
    const result = document.querySelector("#result");

    // Tøm #result før vi legger inn et nytt bilde
    result.innerHTML = "";

    // Opprett et nytt img-element og sett bredden
    const imgElement = document.createElement("img");
    imgElement.width = 512;
    imgElement.src = image;

    // Vent på at bildet er ferdiglastet i nettleseren
    imgElement.addEventListener("load", () => {
      // Nå er bildet klart, så vi skyter konfetti
      triggerConfetti();
    });

    // Legg bildet inn i #result
    result.appendChild(imgElement);
  } catch (err) {
    console.error(err);
    alert(err);
  } finally {
    hideSpinner();
  }
}

function showSpinner() {
  const button = document.querySelector("button");
  button.disabled = true;
  button.innerHTML = 'GENERATING... <span class="spinner">✨</span>';
}

function hideSpinner() {
  const button = document.querySelector("button");
  button.disabled = false;
  button.innerHTML = "GENERATE";
}

function triggerConfetti() {
  jsConfetti.addConfetti({
    emojis: [
      "🎉",
      "🎊",
      "💥",
      "✨",
      "🥳",
      "🎇",
      "🤩",
      "🌟",
      "💖",
      "❤️",
      "😍",
      "💫",
    ],
    emojiSize: 50,
    confettiNumber: 150,
  });
}
