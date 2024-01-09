# Range Slider

A web component range slider. This is very like the `<input type="range" />` element in that it takes a `min`, a `max`, and a `step` attribute but it also takes a `low` and `high`. If you subscribe to the `input` event you will get the low, high, and range (the difference between them) as an object called `values`.

## Usage

All you need is to include this in your document head and it will automatically work when you invoke `<range-slider min="0" max="128" low="0" high="128" step="1"></range-slider>`

You can create this dynamically like this:
```js
const range = document.createElement('range-slider');
      range.min = 0;
      range.max = 128;
      range.low = 10;
      range.high = 50;
      range.step = 1;
document.body.append(range);
```

You can subscribe to the returned values by attaching an event listener to the `input` like so:

```js
range.addEventListener('input', () => {
    console.log(range.values);
});
```

This will return an object with the `low`, `high`, and `range` (the difference between them) like this:

```json
{
    "low": 0,
    "high": 0,
    "range": 0
}
```

## Attribution

This is based loosely on the very elegant example I originally found at: https://codeconvey.com/snippet/html-css-range-slider-with-2-handle-controls-Nj3KvzTY
