document.addEventListener('DOMContentLoaded', function () {
    const screen = document.getElementById('calculatorScreen');
    let currentInput = '';
    let operation = '';
    let firstOperand = '';
    let activeOperator = null;

    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function () {
            const value = this.textContent;
            handleInput(value);
            triggerButtonPressEffect(this);

            if (button.classList.contains('operator') && value !== '=') {
                if (activeOperator) {
                    activeOperator.classList.remove('active-operator');
                }
                activeOperator = button;
                button.classList.add('active-operator');
            }
            if (value === '=') {
                if (activeOperator) {
                    activeOperator.classList.remove('active-operator');
                    activeOperator = null;
                }
            }
        });
    });

    document.addEventListener('keydown', function (event) {
        const keyMap = {
            'Escape': 'AC',
            'Backspace': '←',
            'Enter': '=',
            '/': '/',
            '*': '*',
            '-': '-',
            '+': '+',
            '.': '.',
            '%': '%',
            '1': '1', '2': '2', '3': '3', '4': '4',
            '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0'
        };

        const key = event.key;
        if (keyMap[key]) {
            event.preventDefault();
            const button = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent === keyMap[key]);
            if (button) {
                handleInput(keyMap[key]);
                triggerButtonPressEffect(button);
            }
        }
    });

    function handleInput(value) {
        switch (value) {
            case 'AC':
                resetCalculator();
                break;

            case '←':
                if (currentInput.length > 0) {
                    currentInput = currentInput.slice(0, -1);
                    screen.value = currentInput || '0';
                }
                break;

            case '=':
                if(!currentInput){
                    screen.value = firstOperand;
                    currentInput = firstOperand;
                    operation = '';
                }
                if (firstOperand && operation && currentInput) {
                    sendCalculationRequest(firstOperand, currentInput, operation);
                }
                break;

            case '√':
            case '%':
                if (currentInput) {
                    sendCalculationRequest(currentInput, '', value);
                }
                break;

            case '+':
            case '-':
            case '*':
            case '/':
                if (currentInput) {
                    if (firstOperand && operation) {
                        sendCalculationRequest(firstOperand, currentInput, operation);
                    } else {
                        firstOperand = currentInput;
                        operation = value;
                        currentInput = '';
                        screen.value = currentInput;
                    }
                }
                break;

            case '.':
                if (!currentInput.includes('.')) {
                    currentInput += value;
                    screen.value = currentInput;
                }
                break;

            default: // Handling digit input
                if (currentInput === '0') {
                    currentInput = value;
                } else {
                    currentInput += value;
                }
                screen.value = currentInput;
                break;
        }
    }

    function resetCalculator() {
        currentInput = '';
        firstOperand = '';
        operation = '';
        screen.value = '0';
    }

    function triggerButtonPressEffect(button) {
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 100);
    }

    async function sendCalculationRequest(input1, input2, operation) {
        const response = await fetch('/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input1, input2, operation })
        });
        const data = await response.json();
        console.log(data.result); // Ensure you are receiving a result
        screen.value = data.result; // Display result from the server
        firstOperand = ''; // Reset firstOperand after operation
        operation = ''; // Clear operation
        currentInput = data.result; // Set currentInput to result for further operations
    }
});
