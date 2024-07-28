document.addEventListener('DOMContentLoaded', () => {
    let quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');
    const addQuoteBtn = document.getElementById('addQuoteBtn');
    const exportBtn = document.getElementById('exportQuotes');
    const importFileInput = document.getElementById('importFile');
    const categoryFilter = document.getElementById('categoryFilter');
    const syncBtn = document.getElementById('syncData');

    // Simulate server URL (replace with actual URL if using a real server)
    const serverUrl = 'https://jsonplaceholder.typicode.com/posts';

    // Function to show a random quote
    function showRandomQuote() {
        const filteredQuotes = getFilteredQuotes();
        if (filteredQuotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available.";
            return;
        }
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const randomQuote = filteredQuotes[randomIndex];
        quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
        sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
    }

    // Function to add a quote
    function addQuote(save = true) {
        const newQuoteText = document.getElementById('newQuoteText').value;
        const newQuoteCategory = document.getElementById('newQuoteCategory').value;

        if (newQuoteText.trim() === "" || newQuoteCategory.trim() === "") {
            alert("Please enter both a quote and a category.");
            return;
        }

        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        categories.add(newQuoteCategory);

        if (save) {
            localStorage.setItem('quotes', JSON.stringify(quotes));
            syncWithServer();
        }

        document.getElementById('newQuoteText').value = "";
        document.getElementById('newQuoteCategory').value = "";

        populateCategories();
        alert("Quote added successfully!");
    }

    // Function to populate categories in the filter dropdown
    function populateCategories() {
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    // Function to get filtered quotes based on category
    function getFilteredQuotes() {
        const selectedCategory = categoryFilter.value;
        if (selectedCategory === "all") {
            return quotes;
        }
        return quotes.filter(quote => quote.category === selectedCategory);
    }

    // Function to filter quotes based on selected category
    function filterQuotes() {
        showRandomQuote();
        localStorage.setItem('selectedCategory', categoryFilter.value);
    }

    // Function to export quotes to a JSON file
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

    // Function to import quotes from a JSON file
    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            localStorage.setItem('quotes', JSON.stringify(quotes));
            alert('Quotes imported successfully!');
            populateCategories();
            showRandomQuote();
        };
        fileReader.readAsText(event.target.files[0]);
    }

    // Function to sync with server
    function syncWithServer() {
        // Example of posting data to the server
        fetch(serverUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quotes)
        }).then(response => response.json())
          .then(data => {
              console.log('Data synced with server:', data);
          }).catch(error => {
              console.error('Error syncing data:', error);
          });
    }

    // Function to fetch data from the server
    function fetchFromServer() {
        fetch(serverUrl)
            .then(response => response.json())
            .then(serverQuotes => {
                const localQuotesSet = new Set(quotes.map(q => JSON.stringify(q)));
                const serverQuotesSet = new Set(serverQuotes.map(q => JSON.stringify(q)));

                // Simple conflict resolution: Server data takes precedence
                if (serverQuotesSet.size > localQuotesSet.size) {
                    quotes = serverQuotes;
                    localStorage.setItem('quotes', JSON.stringify(quotes));
                    alert('Quotes updated from server!');
                }
                populateCategories();
                showRandomQuote();
            }).catch(error => {
                console.error('Error fetching data from server:', error);
            });
    }

    // Event listeners
    newQuoteBtn.addEventListener('click', showRandomQuote);
    addQuoteBtn.addEventListener('click', () => addQuote(true));
    exportBtn.addEventListener('click', exportQuotes);
    importFileInput.addEventListener('change', importFromJsonFile);
    syncBtn.addEventListener('click', syncWithServer);

    populateCategories();
    showRandomQuote();

    const lastCategory = localStorage.getItem('selectedCategory');
    if (lastCategory) {
        categoryFilter.value = lastCategory;
    }

    const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
    if (lastQuote) {
        quoteDisplay.innerHTML = `"${lastQuote.text}" - ${lastQuote.category}`;
    } else {
        showRandomQuote();
    }

    // Fetch data from server on load to check for updates
    fetchFromServer();
});
