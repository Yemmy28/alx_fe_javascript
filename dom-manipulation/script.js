document.addEventListener('DOMContentLoaded', async () => {
    let quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');
    const addQuoteBtn = document.getElementById('addQuoteBtn');
    const exportBtn = document.getElementById('exportQuotes');
    const importFileInput = document.getElementById('importFile');
    const categoryFilter = document.getElementById('categoryFilter');
    const syncBtn = document.getElementById('syncData');
    const notification = document.getElementById('notification'); // New notification element

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
            syncQuotes();
        }

        document.getElementById('newQuoteText').value = "";
        document.getElementById('newQuoteCategory').value = "";

        populateCategories();
        showRandomQuote();
        alert("Quote added successfully!");
    }

    // Function to populate categories in the filter dropdown
    function populateCategories() {
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        const categories = new Set(quotes.map(q => q.category));
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
            populateCategories();
            showRandomQuote();
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

    // Function to sync quotes with server
    async function syncQuotes() {
        try {
            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quotes)
            });
            const data = await response.json();
            console.log('Data synced with server:', data);
            displayNotification('Quotes synced with server!');
        } catch (error) {
            console.error('Error syncing data:', error);
            displayNotification('Error syncing quotes with server.');
        }
    }

    // Function to fetch quotes from the server
    async function fetchQuotesFromServer() {
        try {
            const response = await fetch(serverUrl);
            const serverQuotes = await response.json();
            // Compare and update local quotes with server data
            const localQuotesSet = new Set(quotes.map(q => JSON.stringify(q)));
            const serverQuotesSet = new Set(serverQuotes.map(q => JSON.stringify(q)));

            // Simple conflict resolution: Server data takes precedence
            if (serverQuotesSet.size > localQuotesSet.size) {
                quotes = serverQuotes;
                localStorage.setItem('quotes', JSON.stringify(quotes));
                displayNotification('Quotes updated from server!');
            }
            populateCategories();
            showRandomQuote();
        } catch (error) {
            console.error('Error fetching data from server:', error);
        }
    }

    // Function to display notifications
    function displayNotification(message) {
        notification.innerHTML = message;
        setTimeout(() => {
            notification.innerHTML = '';
        }, 5000); // Clear message after 5 seconds
    }

    // Set up periodic sync with server
    setInterval(async () => {
        await fetchQuotesFromServer();
    }, 60000); // Sync every 60 seconds

    // Event listeners
    newQuoteBtn.addEventListener('click', showRandomQuote);
    addQuoteBtn.addEventListener('click', () => addQuote(true));
    exportBtn.addEventListener('click', exportQuotes);
    importFileInput.addEventListener('change', importFromJsonFile);
    syncBtn.addEventListener('click', syncQuotes);

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

    // Fetch quotes from server on load to check for updates
    await fetchQuotesFromServer();
});
