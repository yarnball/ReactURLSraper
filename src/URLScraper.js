import React, { Component } from 'react';
import fetchCheerioObject from 'fetch-cheerio-object';

class URLScraper extends Component {
 constructor(props) {
    super(props);
    this.state = {
      urlContent: '',
      url: '',
    };
  }
  scrapeURL = e => {
     e.preventDefault();
    fetchCheerioObject(
      'https://crossorigin.me/' + this.state.url,
    )
      .then($ => {this.setState({ urlContent: $('title').first().text() });
      });
  }
  render() {
    return (
        <span>
        <input onChange={(e) => this.setState({ url: e.target.value })} placeholder="Give me a URL"/>
        
        <button onClick={this.scrapeURL}> check </button>
        {this.state.urlContent && <div> {this.state.urlContent} {" "}</div> }
        </span>
    );
  }
}

export default URLScraper;
