document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const resultContainer = document.getElementById('result-container');
  const REPO_URL = 'https://raw.githubusercontent.com/ThreatNet/ThreatNet.github.io/refs/heads/main/Threat_Data.json';

  let threatData = {};

  // Fetch the threat database from the URL
  async function fetchThreatData() {
    try {
      const response = await fetch(REPO_URL);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      threatData = await response.json();
      console.log('Threat database loaded successfully:', threatData);
    } catch (error) {
      console.error('Failed to load threat database:', error);
    }
  }

  // Search through the database
  function searchDatabase(query) {
    if (!query || !threatData) {
      resultContainer.innerHTML = '<p>Please enter a valid query or ensure the database is loaded.</p>';
      return;
    }

    query = query.trim();
    const categories = [
      'malicious_wallets',
      'suspicious_domains',
      'phishing_sites',
      'compromised_smart_contracts',
      'malicious_ips',
      'rogue_nodes',
      'suspicious_api_usage',
      'anomalous_transactions',
    ];

    let resultFound = false;
    resultContainer.innerHTML = '';

    categories.forEach(category => {
      if (threatData[category]) {
        threatData[category].forEach(item => {
          if (
            item.address === query || 
            item.domain === query || 
            item.url === query || 
            item.contract_address === query || 
            item.ip_address === query || 
            item.node_address === query || 
            item.endpoint === query || 
            item.tx_id === query
          ) {
            resultFound = true;
            displayResult(category, item);
          }
        });
      }
    });

    if (!resultFound) {
      resultContainer.innerHTML = '<p>No matching entries found in the database.</p>';
    }
  }

  // Display the search result
  function displayResult(category, data) {
    const categoryLabel = category.replace(/_/g, ' ').toUpperCase();
    const details = Object.entries(data)
      .map(([key, value]) => `<li><strong>${key}</strong>: ${Array.isArray(value) ? value.join(', ') : value}</li>`)
      .join('');
    const resultHTML = `
      <div class="result">
        <h3>${categoryLabel}</h3>
        <ul>${details}</ul>
      </div>
    `;
    resultContainer.innerHTML += resultHTML;
  }

  // Event listener for search button
  searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    searchDatabase(query);
  });

  // Load threat data on page load
  fetchThreatData();
});
