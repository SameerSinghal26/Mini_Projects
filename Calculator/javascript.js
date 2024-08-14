let input = "";
let history = [];
let theme = localStorage.getItem("theme") || "light";

document.getElementById("calculator").className = `calculator ${theme}`;
document.getElementById("theme-icon").textContent = theme === "light" ? "☀️" : "🌙";

function appendValue(value) {
    input += value;
    updateDisplay();
}

function clearInput() {
    input = "";
    updateDisplay();
}

function backspace() {
    input = input.slice(0, -1);
    updateDisplay();
}

function calculate() {
    try {
        const result = eval(input);
        if (!isNaN(result) && result !== Infinity && result !== -Infinity) {
            history.push({ input, result });
            updateHistory();
        }
        input = result.toString();
        updateDisplay();
    } catch (error) {
        input = "Error";
        updateDisplay();
    }
}

function updateDisplay() {
    document.getElementById("display").textContent = input;
}

function updateHistory() {
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = history.map(item => `<p>${item.input} = ${item.result}</p>`).join("");
}

document.getElementById("theme-toggle").onclick = function () {
    theme = theme === "light" ? "dark" : "light";
    document.getElementById("calculator").className = `calculator ${theme}`;
    document.getElementById("theme-icon").textContent = theme === "light" ? "☀️" : "🌙";
    localStorage.setItem("theme", theme);
};

// Add listener for keyboard input
document.addEventListener("keydown", function(event) {
    const key = event.key;
    if (!isNaN(key) || key === '.') {
        appendValue(key);
    } else if (key === '+') {
        appendValue('+');
    } else if (key === '-') {
        appendValue('-');
    } else if (key === '*') {
        appendValue('*');
    } else if (key === '/') {
        appendValue('/');
    } else if (key === '%') {
        appendValue('%');
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'Escape') {
        clearInput();
    }
});

document.getElementById("history-toggle").onclick = function () {
    document.getElementById("history").classList.toggle("show");
};

function clearHistory(){
    history = [];
    updateHistory();
}

function showErrorPopup(message) {
    const popup = document.getElementById('popup');
    document.getElementById('popup-message').textContent = message;
    popup.style.display = 'flex';
}

// Close the popup
document.getElementById('close-popup').onclick = function() {
    document.getElementById('popup').style.display = 'none';
};