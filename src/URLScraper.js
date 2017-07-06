import React from 'react';
import $ from 'cheerio';

class URLScraper extends React.Component {
  state = { urlContent: "", url: "https://pandora.com", urlLoading: false };
  scrapeURL = e => {
    // SHOULD something oEmbed if it is any of the common sites (facebook, youtube, github etc.)
    e.preventDefault();
    const { url } = this.state;
    this.setState({
      urlLoading: true,
      rootURL:
        "https://www.google.com/s2/favicons?domain=" +
        url.split("/")[0] +
        "//" +
        url.split("/")[2]
    });
    var urlDom = url
      .split("www.")
      .pop()
      .split("https://")
      .pop()
      .split("http://")
      .pop();
    urlDom = urlDom.charAt(0).toUpperCase() + urlDom.slice(1);
    this.setState({
      urlContent: urlDom
    });
    fetch("https://crossorigin.me/" + this.state.url)
      // crossorigin.me is NOT reliable. Consider other/using own server. Necessary to avoid CORS erros.
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("No response from URL");
        }
      })
      .then(text => {
        if ($.load(text)("title").first().text()) {
          this.setState({
            urlLoading: false,
            urlContent: $.load(text)("title").first().text()
          });
        } else {
          throw new Error("No title attribute");
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({ urlLoading: false });
      });
  };

  render() {
    console.log(this.state.urlLoading);
    const { urlContent, url, urlLoading } = this.state;
    return (
      <span className="linkResult">
        <input
          value={this.state.url}
          onChange={e => this.setState({ url: e.target.value })}
          placeholder="Give me a URL"
        />

        <button onClick={this.scrapeURL}> check </button>
        <br />
        {urlContent &&
          <div>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <img
                className={urlLoading ? "loadingUrl" : ""}
                alt="noidea"
                height="15px"
                src={this.state.rootURL}
              />
              {urlContent}
            </a>
          </div>}
      </span>
    );
  }
}

export default URLScraper;
