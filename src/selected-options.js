class SelectedOptions extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.data = {};
    this.elements = {};
  }

  connectedCallback() {
    const c = document.querySelector("auto-complete");
    c.addEventListener("auto-complete.select", (e) => {
      this.data.destination = e.detail.name;
      this.render();
    });

    const d = document.querySelector("date-picker");
    d.addEventListener("date-picker.select", (e) => {
      // format the date using array functions
      // at the "moment" a library is a bit of overkill ;)
      this.data.date = e.detail.split("-").reverse().join(".");
      this.render();
    });
  }

  render() {
    if (!this.data.destination || !this.data.date) {
      this.shadowRoot.innerHTML = "";
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        h1 {
          color: #2354bd;
        }
      </style>
      <div class="wrapper" id="wrapper">
        <h1>Your selection:</h1>
        <div id="destination">
          <strong>destination:</strong> ${this.data.destination}
        </div>
        <div id="date">
        <strong>date:</strong> ${this.data.date}
        </div>
      </div>  
    `;
  }
}

customElements.define("selected-options", SelectedOptions);
