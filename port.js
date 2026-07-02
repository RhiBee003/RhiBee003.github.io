
// Contact and GitHub overlay buttons

const loadingScreen = document.getElementById("loadingScreen");
const bubbleText = document.getElementById("bubbleText");
const overlayCharacter = document.getElementById("overlayCharacter");
const contactBtn = document.getElementById("contactBtn");
const githubBtn = document.getElementById("githubBtn");

if (contactBtn && loadingScreen && bubbleText && overlayCharacter) {
  contactBtn.addEventListener("click", () => {
    startRedirect({
      image: "images/anime-girl.png",
      text: "I look forward to your message!",
      url: "mailto:rhiblack0017@gmail.com",
    });
  });
}

if (githubBtn && loadingScreen && bubbleText && overlayCharacter) {
  githubBtn.addEventListener("click", () => {
    startRedirect({
      image: "images/github-girl.png",
      text: "Check out my projects!",
      url: "https://github.com/RhiBee003",
    });
  });
}

function startRedirect(data) {
  if (!loadingScreen || !bubbleText || !overlayCharacter) {
    window.open(data.url, data.url.startsWith("mailto:") ? "_self" : "_blank");
    return;
  }

  loadingScreen.classList.remove("hidden");
  loadingScreen.classList.remove("fade-out");
  overlayCharacter.src = data.image;
  bubbleText.textContent = data.text;

  setTimeout(() => {
    loadingScreen.classList.add("fade-out");

    setTimeout(() => {
      if (data.url.startsWith("mailto:")) {
        window.location.href = data.url;
      } else {
        window.open(data.url, "_blank");
      }
    }, 1000);
  }, 4000);
}

function resetOverlay() {
  if (!loadingScreen) {
    return;
  }

  loadingScreen.classList.add("hidden");
  loadingScreen.classList.remove("fade-out");
}

window.addEventListener("focus", resetOverlay);
window.addEventListener("pageshow", resetOverlay);
