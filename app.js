const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const IP = '127.0.0.1';

app.use(express.static('public')); // Serve static files
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});


app.post('/calculate', (req, res) => {
    const { input1, input2, operation } = req.body;
    const result = calculate(input1, input2, operation);
    res.json({ result });
});

function calculate(input1, input2, operation) {
    if (input1 === '') {
        return 'Invalid operation';
    }

    let secondNumber = 0; // Declare it outside the if block to have function scope
    if (input2 !== '') {
        secondNumber = parseFloat(input2);
    }

    const firstNumber = parseFloat(input1);

    switch (operation) {
        case '+':
            return firstNumber + secondNumber;
        case '-':
            return firstNumber - secondNumber;
        case '*':
            return firstNumber * secondNumber;
        case '/':
            if (secondNumber === 0) {
                return 'Cannot divide by zero';
            }
            return firstNumber / secondNumber;
        case '√':
            return Math.sqrt(firstNumber);
        case '%':
            return firstNumber / 100;
        default:
            return 'Invalid operation';
    }
}


app.listen(PORT, IP, () => {
    console.log(`Server running at http://${IP}:${PORT}`);
});
