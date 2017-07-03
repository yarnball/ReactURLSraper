import React, { Component } from 'react';
import './App.css';
import URLScraper from './URLScraper';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Simple URL scraper</h2>
        </div>
        <URLScraper/>
      </div>
    );
  }
}

export default App;
