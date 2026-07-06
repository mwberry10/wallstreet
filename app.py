import yfinance as yf
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/stock/<ticker>')
def get_stock(ticker):
    stock = yf.Ticker(ticker)
    info = stock.info
    
    price = info.get('currentPrice') or info.get('regularMarketPrice')
    
    if price is None:
        return jsonify({'error': 'Stock not found'}), 404
    
    return jsonify({
        'ticker': ticker.upper(),
        'name': info.get('longName', ticker.upper()),
        'price': price,
        'currency': info.get('currency', 'USD')
    })

if __name__ == '__main__':
    app.run(debug=True)