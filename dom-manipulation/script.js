document.addEventListener('DOMContentLoaded', () => {
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');
    const exportBtn = document.getElementById('exportQuotes');

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

    function createImportExportButtons() {
        const exportButton = document.createElement('button');
        exportButton.innerText = 'Export Quotes';
        exportButton.id = 'exportQuotes';
        document.body.appendChild(exportButton);
        exportButton.addEventListener('click', exportQuotes);

        const importFileInput = document.createElement('input');
        importFileInput.type = 'file';
        importFileInput.id = 'importFile';
        importFileInput.accept = '.json';
        importFileInput.addEventListener('change', importFromJsonFile);
        document.body.appendChild(importFileInput);
    }

    newQuoteBtn.addEventListener('click', showRandomQuote);

    loadQuotes();
    createAddQuoteForm();
    createImportExportButtons();

    // Show last quote from session storage if available
    const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
    if (lastQuote) {
        quoteDisplay.innerHTML = `"${lastQuote.text}" - ${lastQuote.category}`;
    } else {
        showRandomQuote();
    }
});
