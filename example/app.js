const CONFERENCES_URL = 'https://raw.githubusercontent.com/paperswithcode/ai-deadlines/gh-pages/_data/conferences.yml';


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

  tt.onmouseleave = e => e.target.style.display = 'none';

  return tt;
}

function addClockWindow(data, container, year) {
  const filtered = filterForYear(data, year);

  const divisionContainer = document.createElement('div');
  divisionContainer.setAttribute('class', 'clock-box');
  container.appendChild(divisionContainer);

  const division = document.createElement('div');
  division.setAttribute('class', 'clock');

  const tooltip = getTooltip();
  const tooltipEnterCallback = getTooltipcallback(tooltip);

  const divisionCanvas = d3.create('svg')
    .attr('xmlns', "https://www.w3.org/2000/svg")
    .style('width', `100%`)
    .style('height', `100%`)
    .style('font', '10px sans-serif')
    .attr('viewBox', `-200 -200 400 400`)
    .attr('preserveAspectRatio', 'none');

  const clock = new RadialClock({
    ...defaultClockOptions,
    hierarchies: 5,
    tierHeight: 25,
    eventLabelSize: '3.5pt',
    showInnerAxis: true,
    showHierarchyLevels: true,
    showOuterAxis: true,
    outerAxisTicksX: 20,
    outerAxisTicksYOffset: 10,
    showMajorAxisHand: new Date().getFullYear() === year,
    showMinorAxisHand: false,
    overlayPast: new Date().getFullYear() === year,
    demarkMonths: !false,
    showEvents: !false,
    innerAxisSuperscript: 'Vision'.toUpperCase(),
    innerAxisSubscript: year.toString(),
    tooltipEnterCallback
  });
  divisionCanvas.append(_ => clock.getClockNode(filtered));
  division.appendChild(tooltip);
  division.onmouseleave = _ => {
    tooltip.style.display = 'none';
  };

  division.appendChild(divisionCanvas.node());
  divisionContainer.appendChild(division);

  const buttonsPane = document.createElement('div');
  buttonsPane.setAttribute('class', 'buttons-pane');

  if (!Browser.isSafari()) {
    const svgExport = document.createElement('button');
    svgExport.innerHTML = 'Export <code>(.svg)</code>';
    svgExport.onclick = async () => {
      const svgAsString = await Utils.svgToString(divisionCanvas.node());
      FileUtils.saveContentAsFile(svgAsString, `Conferences (${year}).svg`);
    }
    buttonsPane.appendChild(svgExport);
  }

  if (Browser.isChrome()) {
    const svgExportPNG = document.createElement('button');
    svgExportPNG.innerHTML = 'Export <code>(.png)</code>';
    svgExportPNG.onclick = async () => {
      const svgAsPNG = await Utils.svgToPng(divisionCanvas.node(), 4);
      FileUtils.saveContentAsFile(svgAsPNG, `Conferences (${year}).png`);
    }
    buttonsPane.appendChild(svgExportPNG);
  }

  divisionContainer.appendChild(buttonsPane);
}

function dateToReadable(unreadable) {
  return moment(unreadable).format('dddd, DD MMMM YYYY').toString();
}

function hindexToTier(hindex) {
  if (hindex > 200) return 0;
  if (hindex > 150) return 1;
  if (hindex > 100) return 2;
  if (hindex > 50) return 3;
  return 4;
}

function filterForYear(data, year) {
  function filterEvent(e) {
    switch (e.type) {
      case 'deadline':
        return moment(new Date(e.on)).year() === year;
      case 'range':
        return moment(new Date(e.from))
          .year() === year || moment(new Date(e.to)).year() === year;
    }
  }

  function clipDeadlinesToYear(e) {
    if (e.type === 'deadline') return e;

    else if (e.type === 'range') {
      const oldFrom = moment(new Date(e.from));
      const oldTo = moment(new Date(e.to));

      if (oldFrom.year() < year) {
        oldFrom.date(1); oldFrom.month(0);
        e.from = dateToReadable(oldFrom);
      }

      if (oldTo.year() > year) {
        oldTo.date(31); oldTo.month(11);
        e.to = dateToReadable(oldTo);
      }

      return e;
    }
  }

  const result = JSON.parse(JSON.stringify(data)).filter(conference => {
    // if there are no milestones, no need to show this
    if (!conference.milestones || !conference.milestones.length) return false;

    conference.milestones = conference.milestones.filter(filterEvent)
      .map(clipDeadlinesToYear);

    return true;
  });

  return result;
}

async function uiScaffold() {
  const slabsElement = document.getElementById('tier-slabs');
  katex.render(String.raw`
    \textrm{tier} = \begin{cases}
      0 & \textrm{if} \; h > 200 \\
      1 & \textrm{if} \; 150 < h \le 200 \\
      2 & \textrm{if} \; 100 < h \le 150 \\
      3 & \textrm{if} \; 50 < h \le 100 \\
      4 & \textrm{otherwise}
    \end{cases}
  `, slabsElement, { throwOnError: true });

  let result = await REST.get(CONFERENCES_URL).catch(console.error);
  result = jsyaml.load(result);
  result = result.map(conference => {
      const reformed = {
      title: conference.title,
      fullName: conference.full_name || conference.id.toUpperCase(),
      milestones: [],
      tier: hindexToTier(conference.hindex),
      hIndex: conference.hindex || 0,
      location: conference.place,
      url: conference.link
    };

    if (conference.deadline != null) {
      reformed.milestones.push({
        type: 'deadline',
        on: dateToReadable(conference.deadline)
      });
    }
    if (conference.start != null && conference.end != null) {
      reformed.milestones.push({
        type: 'range',
        from: dateToReadable(conference.start),
        to: dateToReadable(conference.end)
      });
    }

    return reformed;
  })

  const clocksContainer = document.getElementById('clocks');

  const thisYear = (new Date()).getFullYear();
  addClockWindow(result, clocksContainer, thisYear);
  addClockWindow(result, clocksContainer, thisYear + 1);
}

document.addEventListener('DOMContentLoaded', uiScaffold);
