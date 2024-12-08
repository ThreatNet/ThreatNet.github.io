// Fetch the threat database JSON file
const REPO_URL = 'https://raw.githubusercontent.com/ThreatNet/ThreatNet.github.io/refs/heads/main/Threat_Data.json';

fetch(REPO_URL)
  .then(response => response.json())
  .then(data => populateThreatTable(data))
  .catch(error => console.error('Error fetching threat database:', error));

// Populate table with threats
function populateThreatTable(data) {
  const tableBody = document.getElementById('threatTable');
  tableBody.innerHTML = '';

  data.forEach((threat, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${threat.type}</td>
      <td>${threat.details}</td>
      <td>${threat.reportedBy}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Search threats
function searchThreats() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  
  fetch(REPO_URL)
    .then(response => response.json())
    .then(data => {
      const filteredData = data.filter(threat =>
        threat.type.toLowerCase().includes(query) ||
        threat.details.toLowerCase().includes(query) ||
        threat.reportedBy.toLowerCase().includes(query)
      );
      populateThreatTable(filteredData);
    })
    .catch(error => console.error('Error during search:', error));
}
