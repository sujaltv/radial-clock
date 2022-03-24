# Radial Clock

[![](https://img.shields.io/npm/v/radial-clock)](https://www.npmjs.com/package/radial-clock)
[![](https://img.shields.io/badge/documentation-jsdocs-blue?link=http://radial-clock.surge.sh)](http://radial-clock.surge.sh)

[![Publish documentation to Surge](https://github.com/sujaltv/radial-clock/actions/workflows/surge_publish.yaml/badge.svg)](https://github.com/sujaltv/radial-clock/actions/workflows/surge3_publish.yaml)
[![Publish to npmjs.org](https://github.com/sujaltv/radial-clock/actions/workflows/npm_publish.yaml/badge.svg)](https://github.com/sujaltv/radial-clock/actions/workflows/npm_publish.yaml)

<img src='./docs/assets/example.png' width='300px'>

This is a lightweight JavaScript component integrable with native JavaScript and
other web frameworks.

This plugin is written to keep track of annual events (particularly
[conferences](https://conferences.surge.sh)).

## Injection

```html
  <link rel='stylesheet' href='https://unpkg.com/radial-clock@1.0.0/dist/radial-clock.min.css'>
  ...
  <script src='https://d3js.org/d3.v4.min.js' text='application/js'></script>
  <script src='https://unpkg.com/radial-clock@1.0.0/dist/radial-clock.min.js' text='application/js'>
```

## Usage


```javascript
const data = [
  {
    "title": "ICCV",
    "fullForm": "International Conference on Computer Vision",
    "date": "27 October 2019",
    "url": "https://iccv2019.thecvf.com"
  }
];

const myClockOptions = {
  demarkMonths: true
};

const canvas = d3.select('svg');
const clock = new RadialClock(myClockOptions);
canvas.append(_ => clock.getClockNode(data));
```

See [Documentation](https://radial-clock.surge.sh) for API.
