import { debounce } from "./utils.js";

class Autocomplete extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.results = [];
    this.selectedItem = {};
  }

  connectedCallback() {
    this.render();
    this.input = this.shadowRoot.querySelector("input");
    this.list = this.shadowRoot.querySelector("ul");
    this.list.style.display = "none";
    this.input.addEventListener(
      "input",
      debounce(this.handleInputChange.bind(this), 200)
    );

    this.list.addEventListener("click", (e) => {
      // handle click outside a list item
      if (!e.target.getAttribute("key")) {
        return;
      }
      // get key and name from selected item
      Object.assign(this.selectedItem, {
        key: e.target.getAttribute("key"),
        name: e.target.getAttribute("name")
      });
      this.input.value = this.selectedItem.name;
      // TODO: this could be a reset method
      this.list.innerHTML = "";
      this.list.style.display = "none";
      // emit event
      const event = new CustomEvent("auto-complete.select", {
        detail: this.selectedItem
      });
      this.dispatchEvent(event);
    });
  }

  async handleInputChange() {
    // trim input and check if is < 3
    const trimmedInput = this.input.value.trim();
    if (trimmedInput.length < 3) {
      this.list.innerHTML = "";
      this.list.style.display = "none";
      this.selectedItem = {
        name: "",
        key: ""
      };
      // emit event
      const event = new CustomEvent("auto-complete.select", {
        detail: this.selectedItem
      });
      this.dispatchEvent(event);
      return;
    }

    const inputValue = this.input.value;
    this.results = await this.fetchResults(inputValue);
    this.renderResults();
  }

  async fetchResults(inputValue) {
    if (!inputValue) {
      return [];
    }
    const response = await fetch(
      `https://api.cloud.tui.com/search-destination/v2/de/package/TUICOM/2/autosuggest/peakwork/${inputValue}`
    );
    const [data] = await response.json();
    if (data?.items) {
      return data.items;
    }

    return [];
  }

  renderResults() {
    this.list.innerHTML = "";
    if (this.results.length) {
      this.list.style.display = "block";
    }

    this.results.forEach((item) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      // highlight matched letters
      const r = item.name.replace(
        new RegExp(`(${this.input.value})`, "gi"),
        "<strong>$1</strong>"
      );
      link.innerHTML = r;
      link.href = "#";
      link.setAttribute("key", item.key);
      link.setAttribute("name", item.name);
      listItem.appendChild(link);
      this.list.appendChild(listItem);
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
        }

        a {
          display: inline-block;
          width: 100%;
          text-decoration: none;
          padding: 8px;
          color: #2354bd;
        }

        a:hover {
          background-color: #ccffff;
        }

        .wrapper {
          position: relative;
        }

        label {
          color: #fff;
          text-shadow: 1px 1px 1px rgba(0, 0, 0, .5);
        }

        input {
          width: 100%;
          padding: 8px;
          margin-top: 8px;
          border: none;
          border-radius: 4px;
          height: 40px;
        }

        ul {
          padding: 0;
          margin: 0;
          border: 1px solid #ccc;
          width: 100%;
          position: absolute;
          z-index: 1;
        }

        li {
          list-style-type: none;          
          border-bottom: 1px solid #ccc;
          background: #fff;
        }
      </style>
      <div class="wrapper">
        <form onsubmit="return false">
          <label for="destination">Choose your destination</label>
          <input type="text" id="destination" minlength="3" autocomplete="off" required>
        </form>
        <ul></ul>
      </div>  
    `;
  }
}

customElements.define("auto-complete", Autocomplete);
