const categories = [
  {
    category: 'Computer Vision',
    events: [
      {
        "title": "CVPR",
        "fullName": "Computer Vision and Pattern Recognition",
        "range": {
          "from": "19 June 2022",
          "to": "24 June 2022"
        },
        "tier": 1,
        "url": "https://cvpr2022.thecvf.com/"
      },
      {
        "title": "ICLR",
        "fullName": "International Conference on Learning Representations",
        "range": {
          "from": "25 April 2022",
          "to": "29 April 2022"
        },
        "tier": 2,
        "url": "https://iclr.cc/"
      },
      {
        "title": "ICML",
        "fullName": "International Conference on Machine Learning",
        "range": {
          "from": "17 July 2022",
          "to": "23 July 2022"
        },
        "tier": 2,
        "url": "https://icml.cc"
      },
      {
        "title": "NIPS",
        "fullName": "Neural Information Processing Systems",
        "range": {
          "from": "28 November 2022",
          "to": "9 December 2022"
        },
        "tier": 1,
        "url": "https://nips.cc"
      },
      {
        "title": "ECCV",
        "fullName": "European Conference on Computer Vision",
        "range": {
          "from": "24 October 2022",
          "to": "28 October 2022"
        },
        "tier": 1,
        "url": "https://eccv2022.ecva.net"
      },
      {
        "title": "ICCV",
        "fullName": "International Conference on Computer Vision",
        "range": {
          "from": "22 September 2022",
          "to": "23 September 2022"
        },
        "tier": 1,
        "url": "https://waset.org/computer-vision-conference-in-september-2022-in-vancouver"
      },
      {
        "title": "ICPR",
        "fullName": "International Conference on Pattern Recognition",
        "range": {
          "from": "21 August 2022",
          "to": "25 August 2022"
        },
        "tier": 1,
        "url": "https://www.icpr2022.com"
      },
      {
        "title": "WACV",
        "fullName": "Winter Conference on Applications of Computer Vision",
        "range": {
          "from": "4 January 2022",
          "to": "8 January 2022"
        },
        "tier": 2,
        "url": "https://wacv2022.thecvf.com/home"
      },
      {
        "title": "IJCV",
        "fullName": "International Journal of Computer Vision",
        "date": "29 April 2022",
        "tier": 0,
        "url": "https://www.springer.com/journal/11263"
      }
    ]
  },
  {
    category: 'Robotics',
    events: [
      {
        "title": "IROS",
        "fullName": "International Conference on Intelligent Robots and Systems",
        "range": {
          "from": "23 October 2022",
          "to": "27 October 2022"
        },
        "tier": 2,
        "url": "https://iros2022.org"
      },
      {
        "title": "ICRA",
        "fullName": "International Conference on Robotics and Automation",
        "range": {
          "from": "23 May 2022",
          "to": "27 May 2022"
        },
        "tier": 2,
        "url": "https://www.icra2022.org"
      },
      {
        "title": "CASE",
        "fullName": "International Conference on Robotics and Automation",
        "range": {
          "from": "20 August 2022",
          "to": "24 August 2022"
        },
        "tier": 3,
        "url": "http://case2022.org"
      }
    ]
  }
];

const width = 600;
const height = 600;

const defaultClockOptions = {
  showInnerAxis: true,

  showOuterAxis: true,
  showClockHand: true,

  showHierarchyLevels: true,
  hierarchies: 5,

  demarkMonths: true,

  maxWidth: 200,

  tooltipCallback: null
};

const tooltipElement = document.getElementById('tooltip');
tooltipElement.onmouseleave = hideTooltip;

function hideTooltip() {
  tooltipElement.style.display = 'none';
}

function tooltipEnterCallback(element) {
  if (!tooltipElement) return;

  const title = element.title || '';
  const year = new Date(element.date || element.range.from).getFullYear() || '';
  const fullName = element.fullName || '';
  const url = element.url || null;

  tooltipElement.getElementsByClassName('title')[0].innerHTML = title;
  tooltipElement.getElementsByClassName('year')[0].innerHTML = year;
  const anchor = tooltipElement.getElementsByClassName('full-name')[0];
  anchor.innerHTML = fullName || title;
  if (url) {
    anchor.href = url;
  }
  else {
    anchor.href = '';
  }

  tooltipElement.style.display = 'block';
  tooltipElement.style.left = `${d3.event.pageX+10}px`;
  tooltipElement.style.top = `${d3.event.pageY+10}px`;
}

function tooltipLeaveCallback() {
  if (!tooltipElement) return;
}

const myClockOptions = {
  ...defaultClockOptions,
  maxWidth: 200,
  tooltipEnterCallback,
  tooltipLeaveCallback
};

// const cv_conferences = d3.select('svg#root')
  // .style('width', `${width}px`)
  // .style('height', `${height}px`)
  // .style('font', '10px sans-serif')
  // .attr('viewBox', `${-width/2} ${-height/2} ${width} ${width}`);
// const clock = new RadialClock({
//   ...myClockOptions,
//   innerAxisSuperscript: 'Vision'.toUpperCase(),
//   innerAxisSubscript: '2022'.toUpperCase(),
// });
// cv_conferences.append(_ => clock.getClockNode(cv_data));

// const robot_conferences = d3.select('svg#root2')
//   .style('width', `${width}px`)
//   .style('height', `${height}px`)
//   .style('font', '10px sans-serif')
//   .attr('viewBox', `${-width/2} ${-height/2} ${width} ${width}`);
// const clock2 = new RadialClock({
//   ...myClockOptions,
//   innerAxisSuperscript: 'Robotics'.toUpperCase(),
//   innerAxisSubscript: '2022'.toUpperCase(),
// });
// robot_conferences.append(_ => clock2.getClockNode(robot_data));

function saveContent(content, fileName) {
  const downloader = document.createElement('a');
  downloader.href = content;
  downloader.download = fileName;
  downloader.click();
  downloader.remove();
}

function getClockWindow(data) {
  const divisionContainer = document.createElement('div');
  divisionContainer.setAttribute('class', 'clock-box');

  const division = document.createElement('div');
  division.setAttribute('class', 'clock');

  const divisionCanvas = d3.create('svg')
    .style('width', `100%`)
    .style('height', `100%`)
    .style('font', '10px sans-serif')
    .attr('viewBox', `-100 -100 200 200`)
    .attr('preserveAspectRatio', 'none');

  const clock = new RadialClock({
    ...myClockOptions,
    maxWidth: 50,
    innerAxisSuperscript: data.category.toUpperCase(),
    innerAxisSubscript: '2022'.toUpperCase(),
  });
  divisionCanvas.append(_ => clock.getClockNode(data.events));

  division.appendChild(divisionCanvas.node());
  divisionContainer.appendChild(division);

  const buttonsPane = document.createElement('div');
  buttonsPane.setAttribute('class', 'buttons-pane');

  const svgExport = document.createElement('button');
  svgExport.innerHTML = 'Export <code>(.svg)</code>';
  svgExport.onclick = () => {
    const svgAsString = Utils.svgToString(divisionCanvas.node());
    saveContent(svgAsString, data.category.replace(' ', '_') + '.svg');
  }
  buttonsPane.appendChild(svgExport);

  const pngExport = document.createElement('button');
  pngExport.innerHTML = 'Export <code>(.png)</code>';
  buttonsPane.appendChild(pngExport);

  divisionContainer.appendChild(buttonsPane);

  return divisionContainer;
}

function uiScaffold() {
  const clocksContainer = document.getElementById('clocks');

  for (let category of categories) {
    const categoryElement = getClockWindow(category);
    clocksContainer.appendChild(categoryElement);
  }
}

document.addEventListener('DOMContentLoaded', uiScaffold);
