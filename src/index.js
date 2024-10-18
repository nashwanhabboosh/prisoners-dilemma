const express = require('express'); // Server
const path = require('path'); // Pathing
const simulate = require('./simulate');
const strategies = require('./strategies');
const bodyParser = require('body-parser'); // POST request parsing

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(bodyParser.urlencoded({ extended: true }));

// Route for strategies page
app.get('/strategies', (req, res) => {
    res.render('strategies', { title: 'Strategies Page' });
});

// app.get('/', (req, res) => {
//     const strategyNames = Object.keys(strategies);
//     res.render('menu', { strategyNames });
// });

app.post('/run-function', (req, res) => {
    const selectedFunction = req.body.strategyName; // The function name selected by the user
    const arg1 = parseFloat(req.body.arg1);
    const arg2 = parseFloat(req.body.arg2);

    // Call the selected function with the provided arguments
    const result = functions[selectedFunction](arg1, arg2);

    // Render result
    res.render('result', { result });
});

// Route for root page
app.get('/', (req, res) => {
    res.render('index', { strategy: null }); // Initial load with no render
});

app.post('/process-input', (req, res) => {
    const userInput = req.body.userInput;
    
    const strategyMessage = simulate.dummy(userInput);
    
    res.render('index', { strategy: strategyMessage });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});