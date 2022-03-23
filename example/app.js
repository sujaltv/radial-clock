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

function hideTooltip() {
  this.style.display = 'none';
}

function getTooltipcallback(tooltipElement) {
  const titleElement = tooltipElement.getElementsByClassName('title')[0];
  const yearElement = tooltipElement.getElementsByClassName('year')[0];
  const anchor = tooltipElement.getElementsByClassName('full-name')[0];
  const location = tooltipElement.getElementsByClassName('location')[0];
  const hIndex = tooltipElement.getElementsByClassName('h-index')[0];

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

    location.innerText = element.location || '';
    hIndex.innerText = element.hIndex || '';

    tooltipElement.style.display = 'block';
    tooltipElement.style.left = `${d3.event.clientX+10}px`;
    tooltipElement.style.top = `${d3.event.clientY+10}px`;
  }

  return tooltipEnterCallback;
}

const myClockOptions = {
  ...defaultClockOptions
};

function saveContent(content, fileName) {
  const downloader = document.createElement('a');
  downloader.href = content;
  downloader.download = fileName;
  downloader.click();
  downloader.remove();
}

function getTooltip() {
  const tt = document.createElement('div');
  tt.setAttribute('class', 'tooltip');

  const title = document.createElement('span');
  title.setAttribute('class', 'title');
  tt.appendChild(title);

  const year = document.createElement('span');
  year.setAttribute('class', 'year');
  tt.appendChild(year);

  const link = document.createElement('a');
  link.setAttribute('class', 'full-name');
  link.setAttribute('target', '_blank');
  tt.appendChild(link);

  const location = document.createElement('span');
  location.setAttribute('class', 'location');
  tt.appendChild(location);

  const hIndex = document.createElement('span');
  hIndex.setAttribute('class', 'h-index');
  tt.appendChild(hIndex);

  tt.onmouseleave = hideTooltip;

  return tt;
}

function addClockWindow(data, container) {
  const divisionContainer = document.createElement('div');
  divisionContainer.setAttribute('class', 'clock-box');
  container.appendChild(divisionContainer);

  const division = document.createElement('div');
  division.setAttribute('class', 'clock');

  const tooltip = getTooltip();
  const tooltipEnterCallback = getTooltipcallback(tooltip);

  const divisionCanvas = d3.create('svg')
    .style('width', `100%`)
    .style('height', `100%`)
    .style('font', '10px sans-serif')
    .attr('viewBox', `-100 -100 200 200`)
    .attr('preserveAspectRatio', 'none');

  const today = new Date();

  const clock = new RadialClock({
    ...myClockOptions,
    showInnerAxis: true,
    showHierarchyLevels: true,
    showOuterAxis: true,
    showClockHand: (Number(data.year) || 2022) == today.getFullYear(),
    overlayPast: (Number(data.year) || 2022) == today.getFullYear(),
    demarkMonths: !false,
    showEvents: !false,
    innerAxisSuperscript: data.category.toUpperCase(),
    innerAxisSubscript: (data.year || '2022').toUpperCase(),
    tooltipEnterCallback
  });
  divisionCanvas.append(_ => clock.getClockNode(data.events));
  division.appendChild(tooltip);
  division.onmouseleave = _ => {
    tooltip.style.display = 'none';
  };

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
}

function uiScaffold() {
  const clocksContainer = document.getElementById('clocks');

  for (let category of conferences) {
    addClockWindow(category, clocksContainer);
  }
}

document.addEventListener('DOMContentLoaded', uiScaffold);
