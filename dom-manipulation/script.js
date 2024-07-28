document.addEventListener('DOMContentLoaded', () => {
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');
    const exportBtn = document.getElementById('exportQuotes');
    const addQuoteBtn = document.getElementById('addQuoteBtn');
    const importFileInput = document.getElementById('importFile');

    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available.";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
        sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
    }

    function addQuote(save = true) {
        const newQuoteText = document.getElementById('newQuoteText').value;
        const newQuoteCategory = document.getElementById('newQuoteCategory').value;

        if (newQuoteText.trim() === "" || newQuoteCategory.trim() === "") {
            alert("Please enter both a quote and a category.");
            return;
        }

        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);

        if (save) {
            localStorage.setItem('quotes', JSON.stringify(quotes));
        }

        document.getElementById('newQuoteText').value = "";
        document.getElementById('newQuoteCategory').value = "";
        alert("Quote added successfully!");
    }

    function loadQuotes() {
        quotes.forEach(quote => addQuote(false)); // 'false' indicates not to save again to Local Storage
        showRandomQuote();
    }

    function exportQuotes() {
        const dataStr = JSON.stringify(quotes);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            localStorage.setItem('quotes', JSON.stringify(quotes));
            alert('Quotes imported successfully!');
            loadQuotes();
        };
        fileReader.readAsText(event.target.files[0]);
    }

    newQuoteBtn.addEventListener('click', showRandomQuote);
    addQuoteBtn.addEventListener('click', () => addQuote(true));
    exportBtn.addEventListener('click', exportQuotes);
    importFileInput.addEventListener('change', importFromJsonFile);

    loadQuotes();

    // Show last quote from session storage if available
    const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
    if (lastQuote) {
        quoteDisplay.innerHTML = `"${lastQuote.text}" - ${lastQuote.category}`;
    } else {
        showRandomQuote();
    }
});
