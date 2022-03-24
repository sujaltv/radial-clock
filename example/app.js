function dateToEasyFormat(date) {
  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
    'Saturday'
  ];

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const d = new Date(date);

  return `${days[d.getDay()].substring(0,3)}, ${d.getDate()}
    ${months[d.getMonth()].substring(0,3)} ${d.getFullYear()}`;
}

const defaultClockOptions = {
  showInnerAxis: true,
  innerAxisRadius: 35,

  showOuterAxis: true,
  showClockHand: true,

  showHierarchyLevels: true,
  showEvents: true,
  hierarchies: 5,
  tierHeight: 10,
  overlayPast: true,

  demarkMonths: true,

  tooltipCallback: null
};

const tooltipElement = document.getElementById('tooltip');
tooltipElement.onmouseleave = hideTooltip;

function hideTooltip() {
  tooltipElement.style.display = 'none';
}

const titleElement = tooltipElement.getElementsByClassName('title')[0];
const yearElement = tooltipElement.getElementsByClassName('year')[0];
const anchor = tooltipElement.getElementsByClassName('full-name')[0];

function tooltipEnterCallback(element) {
  if (!tooltipElement) return;

  const title = element.title || '';
  titleElement.innerHTML = title;

  const url = element.url || null;


  switch (element.milestone.type) {
    case 'deadline':
      yearElement.innerHTML =
        `Deadline: ${dateToEasyFormat(element.milestone.on)}`;
      anchor.className = 'full-name deadline';
      break;
      case 'range':
      yearElement.innerHTML = `Conference:
      ${dateToEasyFormat(element.milestone.from)} to
      ${dateToEasyFormat(element.milestone.to)}`;
      anchor.className = 'full-name conference';
      break;
  }

  anchor.innerHTML = element.fullName || title;
  anchor.href = url || '';

  tooltipElement.style.display = 'block';
  tooltipElement.style.left = `${d3.event.pageX+10}px`;
  tooltipElement.style.top = `${d3.event.pageY+10}px`;
}

function tooltipLeaveCallback() {
  if (!tooltipElement) return;
}

const myClockOptions = {
  ...defaultClockOptions,
  tooltipEnterCallback,
  tooltipLeaveCallback
};

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
    showInnerAxis: !false,
    showHierarchyLevels: !false,
    showOuterAxis: !false,
    showClockHand: !false,
    demarkMonths: !false,
    showEvents: !false,
    overlayPast: !false,
    innerAxisSuperscript: data.category.toUpperCase(),
    innerAxisSubscript: (data.year || '2022').toUpperCase(),
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

  divisionContainer.appendChild(buttonsPane);

  return divisionContainer;
}

function uiScaffold() {
  const clocksContainer = document.getElementById('clocks');

  for (let category of conferences) {
    const categoryElement = getClockWindow(category);
    clocksContainer.appendChild(categoryElement);
  }
}

document.addEventListener('DOMContentLoaded', uiScaffold);
