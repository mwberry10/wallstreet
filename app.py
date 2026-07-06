import yfinance as yf
import csv
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

with open('data/constituents.csv', newline='', encoding='utf-8') as f:
    ALL_TICKERS = list(csv.DictReader(f))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/search/<query>')
def search_stocks(query):
    query = query.upper()

    starts_with = [t for t in ALL_TICKERS if t['symbol'].upper().startswith(query)]
    contains = [t for t in ALL_TICKERS if query in t['symbol'].upper() and t not in starts_with]
    name_matches = [
        t for t in ALL_TICKERS
        if query in t['name'].upper() and t not in starts_with and t not in contains
    ]

    results = (starts_with + contains + name_matches)[:8]
    return jsonify(results)

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