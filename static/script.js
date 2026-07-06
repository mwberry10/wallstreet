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