document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
        { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
        { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" }
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');
    const addQuoteBtn = document.getElementById('addQuoteBtn');

    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
    }

    function addQuote() {
        const newQuoteText = document.getElementById('newQuoteText').value;
        const newQuoteCategory = document.getElementById('newQuoteCategory').value;

        if (newQuoteText.trim() === "" || newQuoteCategory.trim() === "") {
            alert("Please enter both a quote and a category.");
            return;
        }

        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        document.getElementById('newQuoteText').value = "";
        document.getElementById('newQuoteCategory').value = "";
        alert("Quote added successfully!");
    }

    newQuoteBtn.addEventListener('click', showRandomQuote);
    addQuoteBtn.addEventListener('click', addQuote);

    // Initial quote display
    showRandomQuote();
});
