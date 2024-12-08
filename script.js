document.addEventListener("DOMContentLoaded", () => {
    const REPO_URL = 'https://raw.githubusercontent.com/ThreatNet/ThreatNet.github.io/refs/heads/main/Threat_Data.json';
    const searchForm = document.getElementById("search-form");
    const inputField = document.getElementById("search-input");
    const resultDisplay = document.getElementById("results");
    let threatDatabase = null;

    // Fetch the threat database
    async function fetchThreatDatabase() {
        try {
            const response = await fetch(REPO_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            threatDatabase = await response.json();
            console.log("Threat database loaded successfully.");
        } catch (error) {
            console.error("Error fetching the threat database:", error);
            resultDisplay.innerHTML = `<p class="error">Failed to load threat database. Please try again later.</p>`;
        }
    }

    // Search the threat database
    function searchThreatDatabase(query) {
        const results = [];
        const categories = Object.keys(threatDatabase);

        categories.forEach(category => {
            const items = threatDatabase[category];
            items.forEach(item => {
                for (const key in item) {
                    if (item[key].toString().toLowerCase().includes(query.toLowerCase())) {
                        results.push({ category, item });
                        break;
                    }
                }
            });
        });

        return results;
    }

    // Display search results
    function displayResults(results) {
        if (results.length === 0) {
            resultDisplay.innerHTML = `<p class="error">No results found for the provided input.</p>`;
            return;
        }

        const resultHTML = results.map(({ category, item }) => {
            const details = Object.entries(item)
                .map(([key, value]) => `<li><strong>${key}:</strong> ${Array.isArray(value) ? value.join(', ') : value}</li>`)
                .join("");
            return `
                <div class="result-card">
                    <h3>${category.replace(/_/g, " ").toUpperCase()}</h3>
                    <ul>${details}</ul>
                </div>`;
        }).join("");

        resultDisplay.innerHTML = resultHTML;
    }

    // Handle search form submission
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const query = inputField.value.trim();
        if (!query) {
            resultDisplay.innerHTML = `<p class="error">Please enter a search term.</p>`;
            return;
        }

        if (!threatDatabase) {
            resultDisplay.innerHTML = `<p class="error">Threat database is not loaded yet. Please wait a moment and try again.</p>`;
            return;
        }

        const results = searchThreatDatabase(query);
        displayResults(results);
    });

    // Fetch the database on load
    fetchThreatDatabase();
});
