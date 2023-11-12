import "./style.css";
import JSConfetti from "js-confetti";

const form = document.querySelector("form");
const textArea = document.querySelector("textarea");
const jsConfetti = new JSConfetti();

form.addEventListener("submit", handleSubmit);

// Ny kode for å håndtere Enter-tasten
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

	const response = await fetch(
		"https://ai-photo-generator-216fed49b0c2.herokuapp.com/",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ prompt }),
		}
	);

	if (response.ok) {
		const { image } = await response.json();
		const result = document.querySelector("#result");
		result.innerHTML = `<img src="${image}" width="512" />`;
		triggerConfetti(); // Kaller konfetti her
	} else {
		const err = await response.text();
		alert(err);
		console.error(err);
	}

	hideSpinner();
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
