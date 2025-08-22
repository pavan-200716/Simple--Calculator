let currentInput = '';
let previousInput = '';
let operation = null;
let shouldResetScreen = false;

const display = document.getElementById('display');

function appendToDisplay(value) {
    if (shouldResetScreen) {
        display.value = '';
        shouldResetScreen = false;
    }
    
    // Prevent multiple decimal points
    if (value === '.' && display.value.includes('.')) {
        return;
    }
    
    // Prevent multiple operators in a row
    if (['+', '-', '*', '/'].includes(value)) {
        if (['+', '-', '*', '/'].includes(display.value.slice(-1))) {
            display.value = display.value.slice(0, -1) + value;
            return;
        }
    }
    
    display.value += value;
}

function clearDisplay() {
    display.value = '';
    currentInput = '';
    previousInput = '';
    operation = null;
    shouldResetScreen = false;
}

function calculate() {
    if (display.value === '' || ['+', '-', '*', '/'].includes(display.value.slice(-1))) {
        return;
    }
    
    try {
        // Replace × with * for evaluation
        const expression = display.value.replace(/×/g, '*');
        const result = eval(expression);
        
        // Handle division by zero
        if (!isFinite(result)) {
            display.value = 'Error';
            return;
        }
        
        display.value = formatResult(result);
        shouldResetScreen = true;
    } catch (error) {
        display.value = 'Error';
    }
}

function formatResult(result) {
    // Round to avoid floating point precision issues
    const rounded = Math.round(result * 100000000) / 100000000;
    
    // Convert to string and remove trailing .0 if present
    let resultStr = rounded.toString();
    
    if (resultStr.includes('.')) {
        // Remove trailing zeros after decimal
        resultStr = resultStr.replace(/\.?0+$/, '');
    }
    
    // If the number is too large, use scientific notation
    if (resultStr.length > 12) {
        return Number(resultStr).toExponential(6);
    }
    
    return resultStr;
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (key === '.') {
        appendToDisplay('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key === '*' ? '×' : key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        display.value = display.value.slice(0, -1);
    }
});

// Prevent default behavior for calculator keys
document.addEventListener('keydown', function(event) {
    const key = event.key;
    if (['+', '-', '*', '/', '=', 'Enter', '.', 'Escape', 'c', 'C', 'Backspace'].includes(key)) {
        event.preventDefault();
    }
});

// Initialize display
clearDisplay();
