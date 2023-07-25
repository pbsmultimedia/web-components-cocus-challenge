class DatePicker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.input = this.shadowRoot.querySelector("input");
    this.input.addEventListener("input", this.handleInputChange.bind(this));
    this.input.addEventListener("click", () => {
      this.input.showPicker();
    });
  }

  handleInputChange() {
    this.input.setAttribute("data-formated-date", this.input.value);
    const event = new CustomEvent("date-picker.select", {
      detail: this.input.value
    });
    this.dispatchEvent(event);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
        }

        label {
          color: #fff;
          text-shadow: 1px 1px 1px rgba(0, 0, 0, .5);
        }

        input {
          position: relative;
          width: 100%;
          padding: 8px;
          margin-top: 8px;
          border: none;
          border-radius: 4px;
          height: 40px;
        }

        input[type=date]:after {
          content: attr(data-formated-date);
          position: absolute;
          width: 70%;
          height: calc(100% - 2px);
          background: #fff;
          pointer-events: none;
          display: flex;
          align-items: center;
          font-family: sans-serif;
        }        
      </style>  
      <div class="wrapper">
        <label for="date">and desired date</label>
        <input type="date" id="date" data-formated-date="">
      </div>  
    `;
  }
}

customElements.define("date-picker", DatePicker);
