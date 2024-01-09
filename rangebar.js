class RangeSlider extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      // Initialize your slider properties here
      this.min       = 0;
      this.max       = 0;
      this.low       = 0;
      this.high      = 0;
      this.step      = 0;
      this.values    = {
        low: 0,
        high: 0,
        range: 0
      };

      // Initialize Shadow DOM structure, styles, etc.
      this.shadowRoot.innerHTML = `
          <div slider id="slider-distance">
            <div>
              <div inverse-low></div>
              <div inverse-high></div>
              <div range></div>
              <span thumb thumb-low></span>
              <span thumb thumb-high></span>
              <div sign sign-low>
                <span id="value">0</span>
              </div>
              <div sign sign-high>
                <span id="value">0</span>
              </div>
            </div>
            <input type="range" low tabindex="0" value="${ this.low }" max="${ this.max }" min="${ this.min }" step="${ this.step }">
            <input type="range" high tabindex="0" value="${ this.high }" max="${ this.max }" min="${ this.min }" step="${ this.step }">
          </div>

          <style>

            [slider] {
              position: relative;
              height: 14px;
              border-radius: 10px;
              text-align: left;
              margin: 45px 0 10px 0;
              // width: 129px;
            }
            
            [slider] > div {
              position: absolute;
              left: 13px;
              right: 15px;
              height: 14px;
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
              position: absolute;
              right: 0;
              height: 14px;
              border-radius: 10px;
              background-color: #CCC;
              margin: 0 7px;
            }
            
            [range] {
              position: absolute;
              left: 0;
              height: 14px;
              border-radius: 14px;
              background-color: #1ABC9C;
            }
            
            [thumb] {
              position: absolute;
              top: -7px;
              z-index: 2;
              height: 28px;
              width: 28px;
              text-align: left;
              margin-left: -11px;
              cursor: pointer;
              box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
              background-color: #FFF;
              border-radius: 50%;
              outline: none;
            }
            
            input[type=range] {
              position: absolute;
              pointer-events: none;
              -webkit-appearance: none;
              z-index: 3;
              height: 14px;
              top: -2px;
              // top: 30px;
              width: 100%;
              -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
              filter: alpha(opacity=0);
              -moz-opacity: 0;
              -khtml-opacity: 0;
              opacity: 0;
              z-index: 10;
            }
            
            input[type=range]::-ms-track {
              -webkit-appearance: none;
              background: transparent;
              color: transparent;
            }
            
            input[type=range]::-moz-range-track {
              -moz-appearance: none;
              background: transparent;
              color: transparent;
            }
            
            input[type=range]:focus::-webkit-slider-runnable-track {
              background: transparent;
              border: transparent;
            }
            
            input[type=range]:focus {
              outline: none;
            }
            
            input[type=range]::-ms-thumb {
              pointer-events: all;
              width: 28px;
              height: 28px;
              border-radius: 0px;
              border: 0 none;
              background: red;
            }
            
            input[type=range]::-moz-range-thumb {
              pointer-events: all;
              width: 28px;
              height: 28px;
              border-radius: 0px;
              border: 0 none;
              background: red;
            }
            
            input[type=range]::-webkit-slider-thumb {
              pointer-events: all;
              width: 28px;
              height: 28px;
              border-radius: 0px;
              border: 0 none;
              background: red;
              -webkit-appearance: none;
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
              opacity: 0;
              position: absolute;
              margin-left: -11px;
              top: -39px;
              z-index:3;
              background-color: #1ABC9C;
              color: #fff;
              width: 28px;
              height: 28px;
              border-radius: 28px;
              -webkit-border-radius: 28px;
              align-items: center;
              -webkit-justify-content: center;
              justify-content: center;
              text-align: center;
            }
            
            [sign]:after {
              position: absolute;
              content: '';
              left: 0;
              border-radius: 16px;
              top: 19px;
              border-left: 14px solid transparent;
              border-right: 14px solid transparent;
              border-top-width: 16px;
              border-top-style: solid;
              border-top-color: #1ABC9C;
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
      // Initialize event listeners, etc.
      this.initializeSlider();
  }

  initializeSlider() {
    // Your initialization logic
    const root = this.shadowRoot.querySelector("#slider-distance");

    if (this.getAttribute("min")) {
      this.min = this.getAttribute("min");
    }
    if (this.getAttribute("max")) {
      this.max = this.getAttribute("max");
    }
    if (this.getAttribute("step")) {
      this.step = this.getAttribute("step");
    }
    if (this.getAttribute("low")) {
      this.low = this.getAttribute("low");
    }
    if (this.getAttribute("low")) {
      this.low = this.getAttribute("low");
    }
    // do some sanitization of the high values
    if (this.getAttribute("high")) {
      this.high = this.getAttribute("high");
    }
    if (this.high <= this.low) {
      console.log("high is same or lower than low", this.low, this.step);
      this.high = this.low + this.step;
    }
    if (this.getAttribute("step")) {
      this.step = this.getAttribute("step");
    }

    // set the default state for each element
    const low  = this.shadowRoot.querySelector("[low]");
    const high = this.shadowRoot.querySelector("[high]");

    // set low values
    low.max    = this.max;
    low.min    = this.min;
    low.step   = this.step;
    low.value  = this.low;

    // set high values
    high.max   = this.max;
    high.min   = this.min;
    high.step  = this.step;
    high.value = this.high;

    low.value = Math.min( low.value , this.high - 1 );
    let l_value = ( 100 / ( parseInt( low.max ) - parseInt( low.min ) ) ) * parseInt( low.value ) - ( 100 / ( parseInt( low.max ) - parseInt( low.min ) ) ) * parseInt( low.min );
    this.shadowRoot.querySelector('[inverse-low]').style.width = l_value + '%';
    this.shadowRoot.querySelector('[range]').style.left  = l_value + '%';
    this.shadowRoot.querySelector('[thumb-low]').style.left  = l_value + '%';
    this.shadowRoot.querySelector('[sign-low]').style.left = l_value + '%';
    this.shadowRoot.querySelector('[sign-low] span').innerHTML = low.value;

    high.value = Math.max( high.value, this.low - ( -1 ) );
    let h_value = ( 100 / ( parseInt( low.max ) - parseInt( low.min ) ) ) * parseInt( high.value ) - ( 100 / ( parseInt( low.max ) - parseInt( low.min ) ) ) * parseInt( low.min );
    this.shadowRoot.querySelector('[inverse-high]').style.width = ( 100 - h_value ) + '%';
    this.shadowRoot.querySelector('[range]').style.right = ( 100 - h_value ) + '%';
    this.shadowRoot.querySelector('[thumb-high]').style.left  = h_value + '%';
    this.shadowRoot.querySelector('[sign-high]').style.left = h_value + '%';
    this.shadowRoot.querySelector('[sign-high] span').innerHTML = high.value;

    // attach a function to each of the input change event
    low.addEventListener("input", () => {
      low.value = Math.min( low.value , high.value - 1 );
      let value = ( 100 / ( parseInt( low.max ) - parseInt( low.min ) ) ) * parseInt( low.value ) - ( 100 / ( parseInt( low.max ) - parseInt( low.min ) ) ) * parseInt( low.min );
      this.shadowRoot.querySelector('[inverse-low]').style.width = value + '%';
      this.shadowRoot.querySelector('[range]').style.left  = value + '%';
      this.shadowRoot.querySelector('[thumb-low]').style.left  = value + '%';
      this.shadowRoot.querySelector('[sign-low]').style.left = value + '%';
      this.shadowRoot.querySelector('[sign-low] span').innerHTML = low.value;
      this.values.low = parseInt(low.value);
      this.values.high = parseInt(high.value);
      this.values.range = high.value - low.value;
      // console.log(this.values);  
      return this.values;
    });

    high.addEventListener("input", () => {
      high.value = Math.max( high.value, low.value - ( -1 ) );
      let value = ( 100 / ( parseInt( low.max ) - parseInt( low.min ) ) ) * parseInt( high.value ) - ( 100 / ( parseInt( low.max ) - parseInt( low.min ) ) ) * parseInt( low.min );
      this.shadowRoot.querySelector('[inverse-high]').style.width = ( 100 - value ) + '%';
      this.shadowRoot.querySelector('[range]').style.right = ( 100 - value ) + '%';
      this.shadowRoot.querySelector('[thumb-high]').style.left  = value + '%';
      this.shadowRoot.querySelector('[sign-high]').style.left = value + '%';
      this.shadowRoot.querySelector('[sign-high] span').innerHTML = high.value;
      this.values.low = parseInt(low.value);
      this.values.high = parseInt(high.value);
      this.values.range = high.value - low.value;
      // console.log(this.values);
      return this.values;
    });
  }

  // Your existing methods go here, adapted to the Web Component context
  // ...

  // Utility functions (if any)
  // ...
  
}

// Register the custom element
customElements.define('range-slider', RangeSlider);
