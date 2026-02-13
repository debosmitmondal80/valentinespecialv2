// --- CONFIGURATION ---
const CORRECT_PASSWORD = "onlyformysona"; 

// --- DATA ---
const quizData = [
    { question: "Hmm, prothom question.... Tui ki amke sarajibon sojjo korte parbi?😏", options: ["Osomvob", "Khostokor", "Chesta korbo", "Partey Hobe...❤️"] },
    { question: "Amader kothai prothom dekha hoyechilo?😊", options: ["Mone ney", "Mone ache", "Bolbo na", "Dekhay hoini"] },
    { question: "Amake koto ta bhalobasis?😁", options: ["Olpo", "Bhalo basiy na", "Onekk", "Prochur....💗♾️"] },
    { question: "Amar upor raag hole ki korbi?", options: ["Block korbo", "Marbo", "Jhogra korbo", "Joriye dhorbo...❤️"] },
    { question: "Koto bochor eksonge thakte chas?", options: ["1 year", "2 years", "5 years", "Sarajibon...❤️"] },
    { question: "Ami kemon?", options: ["Faltu", "Khub faltu 😤", "Thikthak 😐", "Khub bhalo ❤️"] }
];
const reactions = ["🟢Debosmit: O maa tai? 😮", "🟢Debosmit: Sotti bolchis? 🤨", "🟢Debosmit: Bapre !!", "🟢Debosmit: Thik ache.... 😏", "🟢Debosmit: Dushtu.... 🙈", "🟢Debosmit: Achhaaaaaaaa 😏❤️"];

const cardArray = [
    { name: 'rose', icon: '🌹' }, { name: 'rose', icon: '🌹' },
    { name: 'ring', icon: '💍' }, { name: 'ring', icon: '💍' },
    { name: 'bear', icon: '🧸' }, { name: 'bear', icon: '🧸' },
    { name: 'choc', icon: '🍫' }, { name: 'choc', icon: '🍫' },
    { name: 'heart', icon: '❤️' }, { name: 'heart', icon: '❤️' },
    { name: 'couple', icon: '💑' }, { name: 'couple', icon: '💑' }
];

// --- DOM ELEMENTS ---
const screens = {
    login: document.getElementById("login-screen"),
    memory: document.getElementById("memory-screen"),
    catch: document.getElementById("catch-screen"),
    result: document.getElementById("result-overlay"),
    preQuiz: document.getElementById("pre-quiz-screen"),
    quiz: document.getElementById("quiz-screen"),
    permission: document.getElementById("permission-screen"),
    proposal: document.getElementById("proposal-screen")
};

const toast = document.getElementById("toast");
const suspenseOverlay = document.getElementById("suspense-overlay");
const suspenseText = document.getElementById("suspense-text");

// Login
const nameInput = document.getElementById("nameInput");
const passInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");
const errorMsg = document.getElementById("error-msg");
const greetingMsg = document.getElementById("greeting-msg");
const loginBox = document.querySelector(".login-box");

// --- 1. LOGIN ---
loginBtn.addEventListener("click", () => {
    if (nameInput.value.trim() === "") {
        errorMsg.innerText = "Please tell me your name! 🥺";
        triggerShake(); return;
    }
    if (passInput.value.trim().toLowerCase() === CORRECT_PASSWORD) {
        errorMsg.innerText = "";
        greetingMsg.innerText = `Hello, ${nameInput.value}! ❤️`;
        showSuspense("Unlocking Secret World...", 2000, () => {
            changeScreen(screens.login, screens.memory);
            initMemoryGame();
        });
    } else {
        errorMsg.innerText = "Wrong password! Hint: onlyformysona";
        triggerShake();
    }
});

// --- 2. MEMORY GAME ---
const memoryGrid = document.getElementById("memory-grid");
let cardsChosen = [], cardsChosenId = [], cardsWon = [], lockBoard = false;

function initMemoryGame() {
    cardArray.sort(() => 0.5 - Math.random());
    memoryGrid.innerHTML = ""; cardsWon = [];
    for (let i = 0; i < cardArray.length; i++) {
        const card = document.createElement('div');
        card.classList.add('card'); card.setAttribute('data-id', i);
        card.innerHTML = `<div class="front-face">${cardArray[i].icon}</div><div class="back-face">❤️</div>`;
        card.addEventListener('click', flipCard);
        memoryGrid.appendChild(card);
    }
}
function flipCard() {
    let cardId = this.getAttribute('data-id');
    if (lockBoard || cardsChosenId.includes(cardId) || this.classList.contains('flip')) return;
    cardsChosen.push(cardArray[cardId].name); cardsChosenId.push(cardId);
    this.classList.add('flip');
    if (cardsChosen.length === 2) { lockBoard = true; setTimeout(checkForMatch, 600); }
}
function checkForMatch() {
    const cards = document.querySelectorAll('.card');
    const [id1, id2] = cardsChosenId;
    if (cardsChosen[0] === cardsChosen[1]) {
        showToast("Matched! ❤️"); cardsWon.push(cardsChosen);
    } else {
        cards[id1].classList.remove('flip'); cards[id2].classList.remove('flip'); showToast("Try again!");
    }
    cardsChosen = []; cardsChosenId = []; lockBoard = false;
    if (cardsWon.length === cardArray.length / 2) {
        setTimeout(() => showSuspense("Level 1 Complete! Loading Level 2...", 1500, () => changeScreen(screens.memory, screens.catch)), 1000);
    }
}

// --- 3. HEART CATCH GAME ---
const gameScore = document.getElementById("catch-score");
const gameTimer = document.getElementById("catch-timer");
const gameArea = document.getElementById("game-area");
const gameStartBtn = document.getElementById("catch-start-btn");
const finalScoreSpan = document.getElementById("final-score");
const resultNextBtn = document.getElementById("resultNextBtn");
let gameState = { score: 0, timeLeft: 20, isRunning: false };

gameStartBtn.addEventListener("click", startCatchGame);

function startCatchGame() {
    gameState = { score: 0, timeLeft: 20, isRunning: true };
    gameArea.innerHTML = "";
    gameStartBtn.style.display = "none";
    updateCatchStats();
    spawnHeart();
    
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        updateCatchStats();
        if (gameState.timeLeft <= 0) {
            endCatchGame();
        }
    }, 1000);
}

function updateCatchStats() {
    gameScore.innerText = `Score: ${gameState.score}`;
    gameTimer.innerText = `Time: ${gameState.timeLeft}s`;
}

function spawnHeart() {
    if (!gameState.isRunning) return;
    const heart = document.createElement("button");
    heart.className = "falling-heart"; heart.innerText = "💖";
    heart.style.left = Math.random() * 88 + "%";
    heart.style.animationDuration = (2 + Math.random() * 2) + "s";
    
    heart.onmousedown = (e) => {
        e.stopPropagation();
        if (!gameState.isRunning) return;
        gameState.score++; updateCatchStats(); heart.remove();
    };
    heart.ontouchstart = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (!gameState.isRunning) return;
        gameState.score++; updateCatchStats(); heart.remove();
    };
    
    gameArea.appendChild(heart);
    setTimeout(spawnHeart, 350 + Math.random() * 300);
}

function endCatchGame() {
    gameState.isRunning = false;
    clearInterval(gameState.timerInterval);
    finalScoreSpan.innerText = gameState.score;
    screens.catch.classList.add("hidden");
    screens.result.classList.remove("hidden"); screens.result.style.opacity = "1";
    if (typeof confetti === "function") confetti();
}

resultNextBtn.addEventListener("click", () => changeScreen(screens.result, screens.preQuiz));

// --- 4. QUIZ ---
document.getElementById("preQuizBtn").addEventListener("click", () => showSuspense("Starting Quiz...", 1500, () => { changeScreen(screens.preQuiz, screens.quiz); loadQuiz(); }));

let currentQuiz = 0;
function loadQuiz() {
    const data = quizData[currentQuiz];
    document.getElementById("quiz-question").innerText = data.question;
    document.getElementById("progress").innerText = `Level ${currentQuiz + 1}/${quizData.length}`;
    document.getElementById("progress-bar").style.width = ((currentQuiz + 1) / quizData.length * 100) + "%";
    const container = document.getElementById("option-container");
    container.innerHTML = "";
    data.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "quiz-btn"; btn.innerText = opt;
        btn.onclick = () => {
            showToast(reactions[currentQuiz] || "Achha");
            setTimeout(() => {
                currentQuiz++;
                if (currentQuiz < quizData.length) loadQuiz();
                else showSuspense("One last question...", 2000, () => changeScreen(screens.quiz, screens.permission));
            }, 1000);
        };
        container.appendChild(btn);
    });
}

// --- 5. PERMISSION & PROPOSAL ---
const permissionYes = document.getElementById("permissionYes");
const permissionNo = document.getElementById("permissionNo");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const question = document.getElementById("question");
const gif = document.getElementById("gif");
const messageBox = document.getElementById("message-box");

// --- FIX: ROBUST RUNAWAY BUTTON ---
function setupRunawayButton(btn) {
    const moveBtn = () => {
        // Move button to body if not already there (to avoid container clipping)
        if (btn.parentNode !== document.body) {
            const rect = btn.getBoundingClientRect();
            document.body.appendChild(btn);
            btn.style.position = "fixed";
            btn.style.left = rect.left + "px";
            btn.style.top = rect.top + "px";
        }

        // Calculate safe random position within viewport
        const safeWidth = window.innerWidth - btn.offsetWidth - 20;
        const safeHeight = window.innerHeight - btn.offsetHeight - 20;
        const x = Math.max(10, Math.random() * safeWidth);
        const y = Math.max(10, Math.random() * safeHeight);

        // Apply new position
        btn.style.position = "fixed";
        btn.style.left = x + "px";
        btn.style.top = y + "px";
        btn.style.zIndex = "1000"; 
    };

    btn.addEventListener("mouseover", moveBtn);
    btn.addEventListener("touchstart", (e) => { e.preventDefault(); moveBtn(); });
    btn.addEventListener("click", (e) => { e.preventDefault(); moveBtn(); });
}

setupRunawayButton(permissionNo);
setupRunawayButton(noBtn);

permissionYes.addEventListener("click", () => {
    // FIX: Manually hide the runaway button
    permissionNo.style.display = "none";
    showSuspense("Please wait...", 2000, () => changeScreen(screens.permission, screens.proposal));
});

// SITE 2 ENDING
yesBtn.addEventListener("click", () => {
    question.style.display = "none";
    yesBtn.style.display = "none";
    noBtn.style.display = "none"; // Hide runaway No button
    greetingMsg.style.display = "none";

    gif.src = "https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif"; 
    
    messageBox.style.display = "block";
    document.querySelector(".valentine-header").style.display = "block";

    if (typeof confetti === "function") confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });

    const noteText = "You are always in my mind and forever in my heart. 💖\nThank you for making my life beautiful.\n\nHappy Valentine's Day My Love! 🌹";
    const noteElement = document.querySelector(".love-note");
    noteElement.innerHTML = ""; 
    let i = 0;
    function typeWriter() {
        if (i < noteText.length) {
            noteElement.innerHTML += (noteText.charAt(i) === "\n") ? "<br>" : noteText.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    typeWriter();
});

// --- UTILS ---
function showToast(msg) { toast.innerText = msg; toast.className = "show"; setTimeout(() => toast.className = "", 1400); }
function triggerShake() { loginBox.classList.remove("shake-animation"); void loginBox.offsetWidth; loginBox.classList.add("shake-animation"); }
function changeScreen(hide, show) {
    hide.style.opacity = "0";
    setTimeout(() => {
        hide.classList.add("hidden"); show.classList.remove("hidden"); show.style.opacity = "1";
        show.classList.remove("screen-in"); void show.offsetWidth; show.classList.add("screen-in");
    }, 500);
}
function showSuspense(msg, dur, cb) {
    suspenseText.innerText = msg; suspenseOverlay.classList.remove("hidden");
    requestAnimationFrame(() => suspenseOverlay.classList.add("is-visible"));
    setTimeout(() => {
        suspenseOverlay.classList.remove("is-visible");
        setTimeout(() => { suspenseOverlay.classList.add("hidden"); if (cb) cb(); }, 450);
    }, dur);
}