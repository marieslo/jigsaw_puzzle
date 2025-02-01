document.addEventListener("DOMContentLoaded", () => {
    const uploadArea = document.getElementById("uploadArea");
    const imageUpload = document.getElementById("imageUpload");
    const splitImageButton = document.getElementById("splitImageButton");
    const originalImageContainer = document.getElementById("originalImageContainer");
    const shuffledPuzzleArea = document.getElementById("shuffledPuzzleArea");
    const resetImageButton = document.getElementById("resetImageButton");
    const timerDisplay = document.getElementById("timerDisplay");
    const finishButton = document.getElementById("finishButton");

    let imageSrc = null;
    let timerInterval;
    let elapsedTime = 0;
    let timerRunning = false;

    timerDisplay.style.display = "none";

    uploadArea.addEventListener("click", () => imageUpload.click());

    imageUpload.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) handleImageUpload(file);
    });

    function handleImageUpload(file) {
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imageSrc = event.target.result;
                uploadArea.style.display = "none";
                resetImageButton.style.display = "inline-block";
                splitImageButton.style.display = "inline-block";
                splitImageButton.disabled = false;
                originalImageContainer.innerHTML = `<img src="${imageSrc}" alt="Original Image" style="width: 100%; height: auto; opacity: 1;">`;
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please upload a valid image file.");
        }
    }

    resetImageButton.addEventListener("click", () => {
        uploadArea.style.display = "block";
        resetImageButton.style.display = "none";
        splitImageButton.style.display = "none";
        splitImageButton.disabled = true;
        shuffledPuzzleArea.innerHTML = "";
        originalImageContainer.innerHTML = "";
        imageSrc = null;
        stopTimer();
        timerDisplay.textContent = "00:00";
        timerDisplay.style.display = "none";
        finishButton.style.display = "none";
    });

    splitImageButton.addEventListener("click", () => {
        if (!imageSrc) return;
        shuffledPuzzleArea.innerHTML = "";
        shuffledPuzzleArea.style.visibility = "hidden";
        
        $(shuffledPuzzleArea).jigsawPuzzle({
            image: imageSrc,
            rows: 3,
            columns: 3,
            onComplete: function () {
                stopTimer();
                triggerConfetti();
                alert("Congratulations! You completed the puzzle.");
            }
        });

        setTimeout(() => {
            shuffledPuzzleArea.style.visibility = "visible";
            timerDisplay.style.display = "inline-block";
            startTimer();
            splitImageButton.style.display = "none";
            finishButton.style.display = "inline-block";
        }, 100);
    });

    function startTimer() {
        timerDisplay.style.display = "inline-block";
        if (!timerRunning) {
            timerRunning = true;
            timerInterval = setInterval(() => {
                elapsedTime++;
                const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, "0");
                const seconds = String(elapsedTime % 60).padStart(2, "0");
                timerDisplay.textContent = `${minutes}:${seconds}`;
            }, 1000);
        }
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerRunning = false;
    }

    function triggerConfetti() {
        confetti();
    }

    finishButton.addEventListener("click", () => {
        stopTimer();
        triggerConfetti();
    });
});
