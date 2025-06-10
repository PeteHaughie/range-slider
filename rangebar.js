class RangeSlider extends HTMLElement {
  static get observedAttributes() {
    return ['min', 'max', 'low', 'high', 'step'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    // Default values
    this.min = 0;
    this.max = 100;
    this.low = 20;
    this.high = 80;
    this.step = 1;
    this.values = {
      low: this.low,
      high: this.high,
      range: this.high - this.low
    };

    // Shadow DOM structure
    this.shadowRoot.innerHTML = `
      <div slider id="slider-distance">
        <div>
          <div inverse-low></div>
          <div inverse-high></div>
          <div range></div>
          <span thumb thumb-low tabindex="0"></span>
          <span thumb thumb-high tabindex="0"></span>
          <div sign sign-low>
            <span id="value">0</span>
          </div>
          <div sign sign-high>
            <span id="value">0</span>
          </div>
        </div>
        <input type="range" low value="${this.low}" max="${this.max}" min="${this.min}" step="${this.step}">
        <input type="range" high value="${this.high}" max="${this.max}" min="${this.min}" step="${this.step}">
      </div>
      <style>

        [slider] {
          border-radius: 10px;
          height: 14px;
          margin: 45px 0 10px 0;
          position: relative;
          text-align: left;
        }
        
        [slider] > div {
          height: 14px;
          left: 13px;
          position: absolute;
          right: 15px;
        }
        
        [inverse-low] {
          position: absolute;
          left: 0;
          height: 14px;
          border-radius: 10px;
          background-color: #CCC;
          margin: 0 7px;
        }
        
        [inverse-high] {
          background-color: #CCC;
          border-radius: 10px;
          height: 14px;
          margin: 0 7px;
          position: absolute;
          right: 0;
        }
        
        [range] {
          background-color: #1ABC9C;
          border-radius: 14px;
          height: 14px;
          left: 0;
          position: absolute;
        }

        [range]:hover {
          cursor: grab;
        }

        [range]:active {
          background: pink;
          cursor: grabbing;
        }

        [thumb] {
          background-color: #FFF;
          border-radius: 50%;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
          height: 28px;
          margin-left: -11px;
          outline: none;
          position: absolute;
          text-align: left;
          top: -7px;
          width: 28px;
          z-index: 2;
        }
        
        input[type=range] {
          all: unset;
        }
        
        input[type=range]::-ms-track {
          background: transparent;
          color: transparent;
          -webkit-appearance: none;
        }
        
        input[type=range]::-moz-range-track {
          background: transparent;
          color: transparent;
          -moz-appearance: none;
        }
        
        input[type=range]:focus::-webkit-slider-runnable-track {
          background: transparent;
          border: transparent;
        }
        
        input[type=range]:focus {
          outline: none;
        }
        
        input[type=range]::-ms-thumb {
          border: 0 none;
          border-radius: 0px;
          height: 28px;
          pointer-events: all;
          width: 28px;
        }
        
        input[type=range]::-moz-range-thumb {
          height: 28px;
          border: 0 none;
          border-radius: 0px;
          pointer-events: all;
          width: 28px;
        }
        
        input[type=range]::-webkit-slider-thumb {
          border: 0 none;
          border-radius: 0px;
          cursor: grab;
          height: 28px;
          pointer-events: all;
          width: 28px;
          -webkit-appearance: none;
        }

        input[type=range]::-webkit-slider-thumb:active {
          cursor: grabbing;
        }
        
        input[type=range]::-ms-fill-lower {
          background: transparent;
          border: 0 none;
        }
        
        input[type=range]::-ms-fill-upper {
          background: transparent;
          border: 0 none;
        }
        
        input[type=range]::-ms-tooltip {
          display: none;
        }
        
        [sign] {
          align-items: center;
          background-color: #1ABC9C;
          border-radius: 28px;
          color: #fff;
          height: 28px;
          justify-content: center;
          margin-left: -11px;
          opacity: 0;
          position: absolute;
          text-align: center;
          top: -39px;
          width: 28px;
          z-index:3;
          -webkit-border-radius: 28px;
          -webkit-justify-content: center;
        }
        
        [sign]:after {
          border-left: 14px solid transparent;
          border-radius: 16px;
          border-right: 14px solid transparent;
          border-top-color: #1ABC9C;
          border-top-style: solid;
          border-top-width: 16px;
          content: '';
          left: 0;
          position: absolute;
          top: 19px;
        }
        
        [sign] > span {
          font-size: 12px;
          font-weight: 700;
          line-height: 28px;
        }
        
        [slider]:hover > div > [sign] {
          opacity: 1;
        }
      </style>
    `;
  }

  connectedCallback() {
    this.initializeSlider();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const val = parseFloat(newValue);
    if (!isNaN(val)) {
      this[name] = val;
      if (this.shadowRoot) this.updateUI();
    }
  }

  initializeSlider() {
    this.lowInput = this.shadowRoot.querySelector("[low]");
    this.highInput = this.shadowRoot.querySelector("[high]");
    this.rangeEl = this.shadowRoot.querySelector("[range]");
    this.thumbLow = this.shadowRoot.querySelector("[thumb-low]");
    this.thumbHigh = this.shadowRoot.querySelector("[thumb-high]");
    this.signLow = this.shadowRoot.querySelector("[sign-low]");
    this.signHigh = this.shadowRoot.querySelector("[sign-high]");
    this.inverseLow = this.shadowRoot.querySelector("[inverse-low]");
    this.inverseHigh = this.shadowRoot.querySelector("[inverse-high]");

    // Set initial values
    this.lowInput.max = this.max;
    this.lowInput.min = this.min;
    this.lowInput.step = this.step;
    this.lowInput.value = this.low;

    this.highInput.max = this.max;
    this.highInput.min = this.min;
    this.highInput.step = this.step;
    this.highInput.value = this.high;

    this.updateUI();

    // Input event listeners
    this.lowInput.addEventListener("input", () => {
      this.low = Math.min(parseFloat(this.lowInput.value), this.high - 1);
      this.updateUI();
      this.dispatchEvent(new CustomEvent('change', { detail: this.values }));
    });

    this.highInput.addEventListener("input", () => {
      this.high = Math.max(parseFloat(this.highInput.value), this.low + 1);
      this.updateUI();
      this.dispatchEvent(new CustomEvent('change', { detail: this.values }));
    });

    // Keyboard accessibility for thumbs
    this.thumbLow.addEventListener("keydown", (e) => this.handleThumbKey(e, 'low'));
    this.thumbHigh.addEventListener("keydown", (e) => this.handleThumbKey(e, 'high'));

    // Drag logic for thumbs
    this.initThumbDrag(this.thumbLow, 'low');
    this.initThumbDrag(this.thumbHigh, 'high');
    this.initRangeDrag();
  }

  updateUI() {
    // Guard: Only update if inputs are initialized
    if (!this.lowInput || !this.highInput) return;

    // Clamp values
    this.low = Math.max(this.min, Math.min(this.low, this.high - 1));
    this.high = Math.min(this.max, Math.max(this.high, this.low + 1));
    this.lowInput.value = this.low;
    this.highInput.value = this.high;

    const range = this.max - this.min;
    const lPerc = ((this.low - this.min) / range) * 100;
    const hPerc = ((this.high - this.min) / range) * 100;

    this.inverseLow.style.width = `${lPerc}%`;
    this.rangeEl.style.left = `${lPerc}%`;
    this.rangeEl.style.right = `${100 - hPerc}%`;
    this.inverseHigh.style.width = `${100 - hPerc}%`;

    this.thumbLow.style.left = `${lPerc}%`;
    this.thumbHigh.style.left = `${hPerc}%`;
    this.signLow.style.left = `${lPerc}%`;
    this.signHigh.style.left = `${hPerc}%`;
    this.signLow.querySelector("span").textContent = this.low;
    this.signHigh.querySelector("span").textContent = this.high;

    this.values.low = this.low;
    this.values.high = this.high;
    this.values.range = this.high - this.low;
  }

  handleThumbKey(e, which) {
    let delta = 0;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -this.step;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = this.step;
    if (delta !== 0) {
      e.preventDefault();
      if (which === 'low') {
        this.low = Math.min(this.high - 1, Math.max(this.min, this.low + delta));
      } else {
        this.high = Math.max(this.low + 1, Math.min(this.max, this.high + delta));
      }
      this.updateUI();
      this.dispatchEvent(new CustomEvent('change', { detail: this.values }));
    }
  }

  initThumbDrag(thumb, which) {
    let dragging = false;
    let onMove, onUp;
    thumb.addEventListener("mousedown", (e) => {
      e.preventDefault();
      dragging = true;
      document.body.style.userSelect = "none";
      onMove = (moveEvent) => {
        const sliderRect = this.shadowRoot.querySelector("#slider-distance").getBoundingClientRect();
        const x = moveEvent.clientX - sliderRect.left;
        const percent = Math.max(0, Math.min(1, x / sliderRect.width));
        const value = Math.round(this.min + percent * (this.max - this.min));
        if (which === 'low') {
          this.low = Math.min(this.high - 1, Math.max(this.min, value));
        } else {
          this.high = Math.max(this.low + 1, Math.min(this.max, value));
        }
        this.updateUI();
        this.dispatchEvent(new CustomEvent('change', { detail: this.values }));
      };
      onUp = () => {
        dragging = false;
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    });
  }

  initRangeDrag() {
    let dragging = false;
    let startX, startLow, startHigh;
    this.rangeEl.addEventListener("mousedown", (e) => {
      e.preventDefault();
      dragging = true;
      const sliderRect = this.shadowRoot.querySelector("#slider-distance").getBoundingClientRect();
      startX = e.clientX;
      startLow = this.low;
      startHigh = this.high;
      document.body.style.userSelect = "none";
      const onMove = (moveEvent) => {
        const dx = moveEvent.clientX - startX;
        const percent = dx / sliderRect.width;
        const delta = Math.round(percent * (this.max - this.min));
        let newLow = Math.max(this.min, Math.min(startLow + delta, this.max - (startHigh - startLow)));
        let newHigh = newLow + (startHigh - startLow);
        if (newHigh > this.max) {
          newHigh = this.max;
          newLow = newHigh - (startHigh - startLow);
        }
        this.low = newLow;
        this.high = newHigh;
        this.updateUI();
        this.dispatchEvent(new CustomEvent('change', { detail: this.values }));
      };
      const onUp = () => {
        dragging = false;
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    });
  }
}

customElements.define('range-slider', RangeSlider);
