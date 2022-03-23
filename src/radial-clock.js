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
      scale.getMonthAxis(false, 5, 8, 3);

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
        (this.options.hierarchies + 1) * this.options.tierHeight;
      const outerAxis = new RadialAxis(base, base+2);
      outerAxis.getMonthAxis(true, 10, 7.5, 3);

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
              (this.options.hierarchies+(this.options.showOuterAxis ? 1 : 0))})
          `
        );

      this.canvas.append(_ => demarcationGroup.node())
    }

    if (events.length && this.options.showEvents) {
      const eventItem = d3.arc()
        .innerRadius(d =>
          this.options.innerAxisRadius + d.tier * this.options.tierHeight)
        .outerRadius(d =>
          this.options.innerAxisRadius + (d.tier+1) * this.options.tierHeight)
        .startAngle(d => {
          const e = d.milestone;
          switch (e.type) {
            case 'range':
              return Utils.degToRad(Utils.dateToDegreeAngle(new Date(e.from)));
            case 'deadline':
              return Utils.degToRad(Utils.dateToDegreeAngle(new Date(e.on)));
            default:
              return 0;
          }
        })
        .endAngle(d => {
          const e = d.milestone;
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
        });


      const eventsGroup = d3.create('svg:g');

      eventsGroup
        .selectAll('g')
        .data(events.map((e, idx) => ({...e, idx})))
        .enter()
        .append('g')
        .call(element => {
          element
            .each(d => {
              element
                .append('svg:g')
                .selectAll('h')
                .data(d.milestones.map(milestone => ({...d, milestone})))
                .enter()
                .append('path')
                .attr('d', eventItem)
                .attr('fill', d =>
                  d.milestone.type == 'range' ? `#03a9f4` : `#ff5722`)
                .attr('fill-opacity', d =>
                  1 - d.tier/(1.2*this.options.hierarchies)
                )
                .on('mousemove', this.options.tooltipEnterCallback)
                .on('mouseleave', this.options.tooltipLeaveCallback);
            });
        });

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
        .attr('fill-opacity', 0.5)
        .style('pointer-events', 'none');
      this.canvas.append(_ => pastGroup.node())
    }

    if (this.options.showClockHand) {
      const r = this.options.innerAxisRadius +
        (this.options.hierarchies* this.options.tierHeight) - 2.5;
      const theta = Utils.dateToDegreeAngle(new Date());

      const tickHand = Needle.getNeedle(r, 'rgba(0, 35, 35)');
      tickHand.attr('transform', `rotate(${theta})`)
      this.canvas.append(_ => tickHand.node());
    }

    return this.canvas.node();
  }
}
