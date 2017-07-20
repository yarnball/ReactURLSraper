import React from "react";
import $ from "cheerio";

class LinkEmbed extends React.Component {
  state = {
    urlContent: "",
    url: "http://gigst.com",
    urlLoading: false,
    favicon: "",
    color: ""
  };

  matchCols = () => {
    const test = setTimeout(() => {
      if (document.getElementById("favicon")) {
        clearInterval(test);

        try {
          const img = document.getElementById("favicon");
          var vibrant = new window.Vibrant(img);
          var swatches = vibrant.swatches();
          for (var swatch in swatches)
            if (swatches.hasOwnProperty(swatch) && swatches[swatch])
              this.setState({
                color: (swatch, swatches[swatch].getHex())
              });
        } catch (e) {
          console.log(e instanceof TypeError, "Favicon TypeError"); // true
          this.setState({
            favicon:
              "https://crossorigin.me/https://www.google.com/s2/favicons?domain=www.nodejs.org"
          });
        }
      }
    }, 10);
  };
  scrapeURL = e => {
    e.preventDefault();
    const { url } = this.state;
    var urlDom = url
      .split("www.")
      .pop()
      .split("https://")
      .pop()
      .split("http://")
      .pop();
    urlDom = urlDom.charAt(0).toUpperCase() + urlDom.slice(1);
    this.setState({
      color: "",
      favicon: "",
      urlLoading: true,
      urlContent: urlDom
    });
    fetch(
      "https://crossorigin.me/https://www.google.com/s2/favicons?domain=" +
        urlDom
    )
      .then(response => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error("No title attribute");
        }
      })
      .then(imageBlob => {
        if (imageBlob.size > 10) {
          // CATCH THE MAP TypeError at- this fixes issue when a Favicon broken
          this.setState({ favicon: URL.createObjectURL(imageBlob) });
          this.matchCols();
        } else {
          console.log("No image");
        }
      })
      .catch(error => {
        console.log(error);
      });
    fetch("https://crossorigin.me/" + this.state.url)
      // crossorigin.me is necessary to avoid CORS issues.
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("Link didn't work");
        }
      })
      .then(text => {
        if ($.load(text)("title").first().text()) {
          this.setState({
            urlContent: $.load(text)("title").first().text(),
            urlLoading: false
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
    const { urlContent, url, urlLoading, favicon } = this.state;
    return (
      <span className="linkResult">
        <input
          value={this.state.url}
          onChange={e => this.setState({ url: e.target.value })}
          placeholder="Give me a URL"
        />
        <span className={urlLoading ? "loading" : ""}>
          <button type="button" onClick={this.scrapeURL}>
            {" "}{urlLoading ? "loading..." : "Get URL"}{" "}
          </button>
        </span>
        <br />
        {urlContent &&
          <div>
            <a
              style={{ color: this.state.color }}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {favicon
                ? <img
                    crossOrigin="anonymous"
                    id="favicon"
                    className={urlLoading ? "loadingUrl" : ""}
                    alt={urlContent}
                    height="15px"
                    src={favicon}
                  />
                : <img
                    id="faviconTemp"
                    className={urlLoading ? "loadingUrl" : ""}
                    alt="noidea"
                    height="15px"
                    src="https://www.google.com/s2/favicons?domain=www.nodejs.org"
                  />}{" "}
              {urlContent}
            </a>
          </div>}
      </span>
    );
  }
}

export default LinkEmbed;
