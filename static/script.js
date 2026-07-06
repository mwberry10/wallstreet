const input = document.getElementById('ticker-input');
const suggestionsBox = document.getElementById('suggestions');
let debounceTimer;

input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = input.value.trim();

    if (query.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
    }

    debounceTimer = setTimeout(() => fetchSuggestions(query), 300);
});

async function fetchSuggestions(query) {
    try {
        const response = await fetch(`/api/search/${query}`);
        const results = await response.json();
        renderSuggestions(results);
    } catch (error) {
        suggestionsBox.style.display = 'none';
    }
}

function renderSuggestions(results) {
    if (results.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
    }

    suggestionsBox.innerHTML = results.map(r =>
        `<div class="suggestion-item" onclick="selectTicker('${r.symbol}')">
            <strong>${r.symbol}</strong> — ${r.name}
        </div>`
    ).join('');

    suggestionsBox.style.display = 'block';
}

function selectTicker(ticker) {
    input.value = ticker;
    suggestionsBox.style.display = 'none';
    lookupStock();
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('#ticker-input') && !e.target.closest('#suggestions')) {
        suggestionsBox.style.display = 'none';
    }
});


async function lookupStock() {
    const ticker = document.getElementById('ticker-input').value;
    const resultDiv = document.getElementById('stock-result');
    
    resultDiv.textContent = 'Loading...';
    
    try {
        const response = await fetch(`/api/stock/${ticker}`);
        const data = await response.json();
        
        if (response.ok) {
            resultDiv.textContent = `${data.name} (${data.ticker}): $${data.price} ${data.currency}`;
        } else {
            resultDiv.textContent = 'Stock not found. Check the ticker symbol.';
        }
    } catch (error) {
        resultDiv.textContent = 'Something went wrong.';
    }
}