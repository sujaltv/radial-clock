# Radial Clock

This is a lightweight JavaScript web component integrable with native JavaScript
and other web frameworks.

This plugin is written to keep track of annual events (particularly
conferences). Radial coordinate system is perfect to compress data and are a
nice transformation into smaller dimensions, especially with the imaginary axis.

## Installation

```bash
npm install radial-clock
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

For a detailed list of options and use individual elements, refer to the [documentation]().
