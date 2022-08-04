const defaultClockOptions = {
  showInnerAxis: true,
  innerAxisRadius: 35,
  innerAxisSuperscript: 'Radial Clock',
  innerAxisSubscript: 'TVS',

  showOuterAxis: true,
  outerAxisFontSize: 5,
  outerAxisHeight: 12,
  outerAxisTicksX: 10,
  outerAxisTicksYOffset: 7.5,

  eventLabelSize: '1.5pt',

  showMajorAxisHand: true,
  maxjorAxisTicks: [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ],

  showMinorAxisHand: true,
  minorAxisTicks: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31
  ],

  hierarchies: 5,
  showHierarchyLevels: true,
  tierHeight: 10,

  showEvents: true,
  showEventLabels: true,

  overlayPast: true,

  demarkMonths: true,

  tooltipCallback: null,
};


/**
 * This class creates a radial clock.
 */
class RadialClock {
  /**
   * Create a radial clock.
   * @param {object} options Clock options
   */
  constructor(options={}) {
    this.canvas = d3.create('svg:g');
    this.options = {...defaultClockOptions, ...options};
  }

  /**
   * Creates an appendable DOM element for the clock.
   * @param {Array} events A list of events.
   * @returns A DOM element that can be appended to the <code>svg</code> tag.
   */
  getClockNode(events=[]) {
    if (this.options.showInnerAxis) {
      const scale = new RadialAxis(this.options.innerAxisRadius - 4,
        this.options.innerAxisRadius - 2);
      scale.getMonthAxis(this.options.maxjorAxisTicks, false, 5, 8, 3);

      if (this.options.innerAxisSuperscript.length > 0) {
        scale.addScript(this.options.innerAxisSuperscript, -12.5, 3, 35);
      }
      if (this.options.innerAxisSubscript.length > 0) {
        scale.addScript(this.options.innerAxisSubscript, 12.5, 3);
      }

      this.canvas.append(_ => scale.root.node());
    }

    if (this.options.showOuterAxis) {
      const base = this.options.innerAxisRadius +
        (this.options.hierarchies) * this.options.tierHeight +
          this.options.outerAxisHeight;
      const outerAxis = new RadialAxis(base, base+2);
      outerAxis.getMonthAxis(this.options.maxjorAxisTicks, true,
        this.options.outerAxisTicksX, this.options.outerAxisTicksYOffset,
        this.options.outerAxisFontSize);

      this.canvas.append(_ => outerAxis.root.node())
    }

    if (this.options.showHierarchyLevels && this.options.hierarchies > 0) {
      let radius = this.options.innerAxisRadius;
      let ambience = 1;

      const hierarchyPlates = d3.create('svg:g');

      for (let i = 0; i < this.options.hierarchies; i++) {
        const h = d3.arc()
          .innerRadius(radius)
          .outerRadius(radius + this.options.tierHeight)
          .startAngle(Utils.degToRad(0))
          .endAngle(Utils.degToRad(360));

        const tier = d3.create('svg:g');

        tier
          .append('path')
          .style('fill', `rgba(0, 50, 50, ${ambience})`)
          .attr('d', h);
        hierarchyPlates.append(_ => tier.node())

        radius += this.options.tierHeight;
        ambience -= 1/this.options.hierarchies;
      }

      this.canvas.append(_ => hierarchyPlates.node());
    }

    if (this.options.demarkMonths) {
      const tick = d3.line(0, 0)([[0,0], [0,-1]]);

      const demarcationGroup = d3.create('svg:g');

      demarcationGroup
        .selectAll('g')
        .data(RadialAxis.ticks.map((month, idx) => ({month, idx})))
        .enter()
        .append('path')
        .attr('d', tick)
        .attr('stroke', 'rgba(0,0,0,0.25)')
        .attr('stroke-width', '0.125px')
        .attr('transform',
          d => `
            rotate(${d.idx * 360/12} 0 0)
            translate(0 ${-this.options.innerAxisRadius})
            scale (1, ${this.options.tierHeight *
              (this.options.hierarchies) +
              (this.options.showOuterAxis ? this.options.outerAxisHeight : 0)})
          `
        );

      this.canvas.append(_ => demarcationGroup.node())
    }

    if (events.length && this.options.showEvents) {
      function eventStartAngle(event) {
        const e = event.milestone;
        switch (e.type) {
          case 'range':
            return Utils.degToRad(Utils.dateToDegreeAngle(new Date(e.from)));
          case 'deadline':
            return Utils.degToRad(Utils.dateToDegreeAngle(new Date(e.on)));
          default:
            return 0;
        }
      }

      function eventEndAngle(event) {
        const e = event.milestone;
        switch (e.type) {
          case 'range':
            return Utils.degToRad(Utils.dateToDegreeAngle(new Date(e.to)));
          case 'deadline':
            return Utils.degToRad(
              Utils.dateToDegreeAngle(new Date(e.on)) + (360/RadialAxis.ticks
                .length) / Utils.getMaxDaysInMonth(new Date(e.on))
            );
          default:
            return 0;
        }
      }

      const eventItem = d3.arc()
        .innerRadius(d =>
          this.options.innerAxisRadius + d.tier * this.options.tierHeight)
        .outerRadius(d =>
          this.options.innerAxisRadius + (d.tier+1) * this.options.tierHeight)
        .startAngle(eventStartAngle)
        .endAngle(eventEndAngle);

      const eventsGroup = d3.create('svg:g');

      eventsGroup
      .selectAll('g')
        .data(events.map((e, idx) => ({...e, idx})))
        .enter()
        .each(d => {
          const conferenceGroup = d3.create('svg:g');

          const eventPathTextGroup = conferenceGroup
            .selectAll('g')
            .data(d.milestones.map(milestone => ({...d, milestone})))
            .enter()
            .append('svg:g');

          const randId = Utils.randotron(8);
          eventPathTextGroup
            .append('path')
            .attr('d', eventItem)
            .attr('fill', d =>
              d.milestone.type == 'range' ? `#03a9f4` : `#ff5722`)
            .attr('fill-opacity', d =>
              (this.options.hierarchies - (d.tier)+0.5)/this.options.hierarchies
            )
            .on('mousemove', this.options.tooltipEnterCallback)
            .on('mouseleave', this.options.tooltipLeaveCallback);

          if (this.options.showEventLabels) {
            eventPathTextGroup
              .append('path')
              .attr('d', d3.line()([[0,0],[0,-this.options.tierHeight]]))
              .attr('id', d => `event_${d.milestone.type}_${randId}_${d.idx}`)
              .attr('stroke', 'none')
              .style('pointer-events', 'none')
              .attr('transform', d => {
                const innerRadius = this.options.innerAxisRadius +
                  d.tier * this.options.tierHeight;
                const outerRadius = this.options.innerAxisRadius +
                  (d.tier+1) * this.options.tierHeight;

                const startAngle = eventStartAngle(d);
                const endAngle = eventEndAngle(d);

                let theta = startAngle;
                let x = - innerRadius * Math.cos(theta);
                let y = innerRadius * Math.sin(theta);
                let scale = 'scale(1 1)';

                if (theta > Utils.degToRad(180)) {
                  theta = endAngle;
                  x = - outerRadius * Math.cos(theta);
                  y = outerRadius * Math.sin(theta);
                  scale = 'scale(1 -1)';
                }

                return `
                  translate(${y} ${x})
                  rotate(${Utils.radToDeg(theta)})
                  ${scale}
                `
              });

            eventPathTextGroup
              .append('text')
              .attr('x', this.options.tierHeight/2)
              .attr('dy', -1.5)
              .append('textPath')
                .attr('dominant-baseline', "middle")
                .attr('fill', d =>
                  d.milestone.type == 'range' ? `#03a9f4` : `#ff5722`)
                .attr('text-anchor', "middle")
                .attr('href',
                  d => `#event_${d.milestone.type}_${randId}_${d.idx}`)
                .style('font-size', this.options.eventLabelSize)
                .text(d => d.title)
                .style('pointer-events', 'none');
            }

          eventsGroup.append(_ => conferenceGroup.node());
        })

      this.canvas.append(_ => eventsGroup.node());
    }

    if (this.options.overlayPast) {
      const past = d3.arc()
      .innerRadius(this.options.innerAxisRadius)
      .outerRadius(this.options.innerAxisRadius +
        (this.options.hierarchies + (this.options.showOuterAxis ? 1 : 0)) *
          this.options.tierHeight)
      .startAngle(0)
      .endAngle(Utils.degToRad(Utils.dateToDegreeAngle(new Date())));

      const pastGroup = d3.create('svg:g');
      pastGroup.append('path')
        .attr('d', past)
        .attr('fill', 'white')
        .attr('fill-opacity', 0.25)
        .style('pointer-events', 'none');
      this.canvas.append(_ => pastGroup.node())
    }

    if (this.options.showMajorAxisHand) {
      const r = (this.options.innerAxisRadius +
        (this.options.hierarchies* this.options.tierHeight) - 2.5) * (2/3);
      const theta = Utils.dateToDegreeAngle(new Date());

      const tickHand = Needle.getNeedle(r, 'rgba(0, 35, 35)');
      tickHand
        .attr('transform', `rotate(${theta})`)
        .style('pointer-events', 'none');
      this.canvas.append(_ => tickHand.node());
    }

    if (this.options.showMinorAxisHand) {
      const r = this.options.innerAxisRadius +
        (this.options.hierarchies* this.options.tierHeight) - 2.5;
      const theta = Utils.dayToDegreeAngle(new Date());

      const tickHand = Needle.getNeedle(r, 'rgba(0, 35, 35)');
      tickHand
        .attr('transform', `rotate(${theta})`)
        .style('pointer-events', 'none');
      this.canvas.append(_ => tickHand.node());
    }

    return this.canvas.node();
  }
}
