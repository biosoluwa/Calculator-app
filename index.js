// HTML elements
const display = document.getElementById("display");
const numberButtons = document.querySelectorAll(".numbers");
const operatorButtons = document.querySelectorAll(".operators");
const equalsButton = document.querySelector(".equals");

// Identify the clear button: Based on your HTML, this is the button with the image.
const clearButtonWithImage = document
  .querySelector(".numbers img")
  .closest("button");

// Calculator state variables
let currentOperand = "";
let previousOperand = "";
let operation = null;
let history = [];

// --- Display Management Functions ---
function updateDisplay() {
  display.value = currentOperand === "" ? "0" : currentOperand;
}

function updateHistoryConsole() {
  console.log("--- Calculator History ---");
  if (history.length === 0) {
    console.log("No history yet.");
  } else {
    history.forEach((item, index) => {
      console.log(`${index + 1}: ${item}`);
    });
  }
  console.log("--------------------------");
}

// --- Calculator Logic Functions ---

function appendNumber(number) {
  if (number === "." && currentOperand.includes(".")) {
    return;
  }
  if (currentOperand === "0" && number !== ".") {
    currentOperand = number;
  } else {
    currentOperand += number;
  }
  updateDisplay();
}

function chooseOperation(op) {
  if (currentOperand === "") return;

  if (previousOperand !== "") {
    calculate();
  }

  operation = op;
  previousOperand = currentOperand;
  currentOperand = "";
  display.value = previousOperand + " " + operation;
}

function calculate() {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) return;

  let computation;
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "×": // Multiplication
      computation = prev * current;
      break;
    case "÷": // Division
      if (current === 0) {
        alert("Error: Cannot divide by zero!");
        clearAll(); // Reset calculator on error
        return;
      }
      computation = prev / current;
      break;
    case "%": // Modulo
      computation = prev % current;
      break;
    case "^": // Exponentiation
      computation = Math.pow(prev, current);
      break;
    default:
      return; // No valid operation selected
  }

  currentOperand = parseFloat(computation.toFixed(10)).toString();

  // Add the calculation to history and update console history
  const historyEntry = `${previousOperand} ${operation} ${current} = ${currentOperand}`;
  history.push(historyEntry);
  updateHistoryConsole();

  // Reset operation and previous operand after calculation
  operation = null;
  previousOperand = "";
  updateDisplay();
}

function clearAll() {
  currentOperand = "";
  previousOperand = "";
  operation = null;
  history = []; // Clear history
  updateDisplay();
  updateHistoryConsole(); // Clear console history display
}

function backspace() {
  if (currentOperand === "") return; // Do nothing if there's no input
  currentOperand = currentOperand.slice(0, -1); // Remove the last character
  updateDisplay();
}

// --- Event Listeners for Button Clicks ---

numberButtons.forEach((button) => {
  if (button === clearButtonWithImage) {
    button.addEventListener("click", clearAll);
  } else {
    button.addEventListener("click", () => {
      appendNumber(button.textContent.trim());
    });
  }
});

// Add click listeners to all operator buttons
operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    chooseOperation(button.textContent.trim());
  });
});

// Add click listener for the equals (=) button
equalsButton.addEventListener("click", calculate);

window.addEventListener("keydown", (e) => {
  // Number and Decimal Point keys
  if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
    appendNumber(e.key);
  }
  // Operator keys
  else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
    // Map keyboard '*' to '×' and '/' to '÷' for consistency with display
    const operatorKey = e.key === "*" ? "×" : e.key === "/" ? "÷" : e.key;
    chooseOperation(operatorKey);
  }
  // Enter key for equals
  else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault(); // Prevent default Enter key behavior (e.g., form submission)
    calculate();
  }
  // Backspace key
  else if (e.key === "Backspace") {
    backspace();
  } else if (e.key === "Escape") {
    clearAll();
  } else if (e.key === "%") {
    chooseOperation("%");
  } else if (e.key === "^") {
    chooseOperation("^");
  }
});

// Initial display update when the script loads
updateDisplay();
updateHistoryConsole(); // Also log initial empty history
