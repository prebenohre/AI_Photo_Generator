// Importerer stilark og JSConfetti-modulen.
import "./style.css";
import JSConfetti from "js-confetti";

// Velger form-elementet og textarea-elementet fra dokumentet.
const form = document.querySelector("form");
const textArea = document.querySelector("textarea");
const jsConfetti = new JSConfetti();

// Oppretter en ny instans av JSConfetti.
form.addEventListener("submit", handleSubmit);

// Legger til en event listener for å håndtere 'keypress'-hendelsen på textarea.
// Denne sjekker om brukeren trykker på Enter-tasten.
textArea.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // // Forhindrer standard oppførsel (ny linje).
    handleSubmit(event); // Kaller handleSubmit-funksjonen.
  }
});

// Definerer funksjonen som håndterer innsending av skjemaet.
async function handleSubmit(e) {
  e.preventDefault(); // Forhindrer skjemaet i å sende en HTTP-forespørsel på vanlig måte.
  showSpinner(); // Viser en spinner på knappen for å indikere prosessering.
  const prompt = textArea.value; // Henter innholdet av textarea.

  // Sender en POST-forespørsel til serveren.
  const response = await fetch(
    "https://ai-photo-generator-0108636d5bc8.herokuapp.com/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    },
  );

  if (response.ok) {
    // Behandler svaret fra serveren hvis forespørselen var vellykket.
    const { image } = await response.json();
    const result = document.querySelector("#result");
    result.innerHTML = `<img src="${image}" width="512" />`;
    triggerConfetti(); // Utløser konfetti-animasjon.
  } else {
    // Håndterer feil fra serveren.
    const err = await response.text();
    alert(err);
    console.error(err);
  }

  hideSpinner(); // Skjuler spinneren.
}

// Viser en spinner på genereringsknappen.
function showSpinner() {
  const button = document.querySelector("button");
  button.disabled = true;
  button.innerHTML = 'GENERATING... <span class="spinner">✨</span>';
}

// Skjuler spinneren og gjenaktiverer knappen.
function hideSpinner() {
  const button = document.querySelector("button");
  button.disabled = false;
  button.innerHTML = "GENERATE";
}

// Definerer funksjonen for å utløse konfetti-animasjonen.
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
    emojiSize: 50, // Størrelsen på emojiene i konfetti-animasjonen.
    confettiNumber: 150, // Antall konfettibiter som skal vises.
  });
}
