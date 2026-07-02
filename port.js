

// new scripts for two anime //


const loadingScreen = document.getElementById("loadingScreen");

const bubbleText = document.getElementById("bubbleText");

const overlayCharacter =
  document.getElementById("overlayCharacter");

/* EMAIL BUTTON */

document
  .getElementById("contactBtn")
  .addEventListener("click", () => {

    startRedirect({
      image: "images/anime-girl.png",
      text: "I look forward to your message!",
      url: "mailto:rhiblack0017@gmail.com"
    });

});

/* GITHUB BUTTON */

document
  .getElementById("githubBtn")
  .addEventListener("click", () => {

    startRedirect({
      image: "images/github-girl.png",
      text: "Check out my projects!",
      url: "https://github.com/RhiBee003"
    });

});

/* MAIN FUNCTION */

function startRedirect(data){

  /* RESET */

  loadingScreen.classList.remove("hidden");
  loadingScreen.classList.remove("fade-out");

  /* CHANGE CONTENT */

  overlayCharacter.src = data.image;

  bubbleText.textContent = data.text;

  /* WAIT */

  setTimeout(() => {

    loadingScreen.classList.add("fade-out");

    /* REDIRECT */

    setTimeout(() => {

        if(data.url.startsWith("mailto:")){

            const link = document.createElement("a");
          
            link.href = data.url;
          
            link.click();
          
          }
          
          else{
          
            window.open(data.url, "_blank");
          
          }

    }, 1000);

  }, 4000);

}

/* RESET OVERLAY */

window.addEventListener("focus", resetOverlay);

window.addEventListener("pageshow", resetOverlay);

function resetOverlay(){

  loadingScreen.classList.add("hidden");

  loadingScreen.classList.remove("fade-out");

}