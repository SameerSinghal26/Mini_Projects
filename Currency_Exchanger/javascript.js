document.getElementById("entered_amount").textContent = "0.00";
document.getElementById("converted_value").textContent = "0.00";
let input = "";
let history = [];
let theme = localStorage.getItem("theme") || "light";
const fromCur = document.querySelector(".from select");
const toCur = document.querySelector(".to select");

document.getElementById("calculator").className = `calculator ${theme}`;
document.getElementById("theme-icon").textContent = theme === "light" ? "☀️" : "🌙";

// Theme toggle

document.getElementById("theme-toggle").onclick = function () {
    theme = theme === "light" ? "dark" : "light";
    document.getElementById("calculator").className = `calculator ${theme}`;
    document.getElementById("theme-icon").textContent = theme === "light" ? "☀️" : "🌙";
    localStorage.setItem("theme", theme);
};

function appendValue(value) {
    input += value;
    updateDisplay1();
    currencyconversion();
}

function clearInput() {
    input = "";
    document.getElementById("entered_amount").textContent = "0.00";
    document.getElementById("converted_value").textContent = "0.00";
}

function backspace() {
    input = input.slice(0, -1);
    if(input === ""){
        document.getElementById("entered_amount").textContent = "0.00";
        document.getElementById("converted_value").textContent = "0.00";
    }else{
        updateDisplay1();
        currencyconversion();
    }
}

function calculate() {
    try {
        const result = eval(input);
        if (!isNaN(result) && result !== Infinity && result !== -Infinity) {
            history.push({ input, result });
            input = result.toString();
            updateDisplay1();
            currencyconversion();
        }
    } catch (error) {
        input = "Error";
        updateDisplay1();
        updateDisplay();
        showErrorPopup("Invalid Operation");
    }
}

function updateDisplay1() {
    document.getElementById("entered_amount").textContent = input;
    currencyconversion();
}

function updateDisplay(convertedValue = null) {
    document.getElementById("converted_value").textContent = convertedValue || input;
    updateHistory(convertedValue);
}

function updateHistory() {
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = history.map(item => `<p>${item.input} = ${item.result}</p>`).join("");
}

// Add listener for keyboard input

document.addEventListener("keydown", function(event) {
    event.preventDefault();
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

// History toggle

document.getElementById("history-toggle").onclick = function () {
    document.getElementById("history").classList.toggle("show");
};

// Clear history

function clearHistory() {
    history = [];
    updateHistory();
    clearInput();
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

// Country adding in the selection box

[fromCur, toCur].forEach((select, i) => {
    for (let curCode in Country_List) {
        const selected = (i === 0 && curCode === "USD") || (i === 1 && curCode === "GBP") ? "selected" : "";
        select.insertAdjacentHTML("beforeend", `<option value="${curCode}" ${selected}>${curCode}</option>`);
    }
    select.addEventListener("change", () => {
        const code = select.value;
        const imgTag = select.parentElement.querySelector("img");
        imgTag.src = `https://flagcdn.com/48x36/${Country_List[code].toLowerCase()}.png`;
    });
});

// Currency conversion code

const BASE_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies';

const currencyconversion = async () => {
    let amount = document.getElementById("entered_amount").innerText;
    let fromCurrency = document.querySelector(".from select").value.toLowerCase();
    let toCurrency = document.querySelector(".to select").value.toLowerCase();
    if (amount === "" || amount < 1) {
        amount = 1;
        document.getElementById("entered_amount").innerHTML = 1;
    }

    const URL = `${BASE_URL}/${fromCurrency}.json`;

    try {
        const response = await fetch(URL);
        const data = await response.json();
        let rate = data[fromCurrency][toCurrency];
        const convertedValue = (amount * rate).toFixed(4);
        updateDisplay(convertedValue);
    } catch (error) {
        showErrorPopup('Conversion error');
    }
};

// Swap button code

const exIcon = document.querySelector(".reverse-button");
exIcon.addEventListener("click", () => {
    [fromCur.value, toCur.value] = [toCur.value, fromCur.value];
    [fromCur, toCur].forEach((select) => {
        const code = select.value;
        const imgTag = select.parentElement.querySelector("img");
        imgTag.src = `https://flagcdn.com/48x36/${Country_List[code].toLowerCase()}.png`;
    });
    currencyconversion();
});