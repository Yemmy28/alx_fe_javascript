document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
        { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" }
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');

    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
    }

    function addQuote(taskText, save = true) {
        const newQuoteText = document.getElementById('newQuoteText').value;
        const newQuoteCategory = document.getElementById('newQuoteCategory').value;

        if (newQuoteText.trim() === "" || newQuoteCategory.trim() === "") {
            alert("Please enter both a quote and a category.");
            return;
        }

        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);

        if (save) {
            const storedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]');
            storedQuotes.push(newQuote);
            localStorage.setItem('quotes', JSON.stringify(storedQuotes));
        }

        document.getElementById('newQuoteText').value = "";
        document.getElementById('newQuoteCategory').value = "";
        alert("Quote added successfully!");
    }

    function loadQuotes() {
        const storedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]');
        storedQuotes.forEach(quote => addQuote(quote.text, quote.category, false)); // 'false' indicates not to save again to Local Storage
    }

    function createAddQuoteForm() {
        const quoteInputContainer = document.createElement('div');
        quoteInputContainer.innerHTML = `
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button id="addQuoteBtn">Add Quote</button>
        `;
        document.body.appendChild(quoteInputContainer);

        const addQuoteBtn = document.getElementById('addQuoteBtn');
        addQuoteBtn.addEventListener('click', () => addQuote(true));
    }

    newQuoteBtn.addEventListener('click', showRandomQuote);

    // Initial setup
    loadQuotes();
    createAddQuoteForm();
    showRandomQuote();
});
