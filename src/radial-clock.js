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
    const innerShellRadius = 50;
    const tierHeight = this.options.maxWidth / this.options.hierarchies;

    if (this.options.showInnerAxis) {
      const scale = new RadialAxis(45, 47);
      scale.getMonthAxis(false);

      if (this.options.innerAxisSuperscript.length > 0) {
        scale.addScript(this.options.innerAxisSuperscript, -18.5, 4, 40);
      }
      if (this.options.innerAxisSubscript.length > 0) {
        scale.addScript(this.options.innerAxisSubscript, 15, 5.5);
      }

      this.canvas.append(_ => scale.root.node());
    }

    if (this.options.showOuterAxis) {
      const base = (this.options.hierarchies+1) * tierHeight + 20;
      const outerAxis = new RadialAxis(base, base+2);
      outerAxis.getMonthAxis(true, 50);

      this.canvas.append(_ => outerAxis.root.node())
    }

    if (this.options.showHierarchyLevels && this.options.hierarchies > 0) {
      let radius = innerShellRadius;
      let ambience = 1;

      const hierarchyPlates = d3.create('svg:g');

      for (let i = 0; i < this.options.hierarchies; i++) {
        const h = d3.arc()
          .innerRadius(radius)
          .outerRadius(radius + tierHeight)
          .startAngle(Utils.degToRad(0))
          .endAngle(Utils.degToRad(360));

        const tier = d3.create('svg:g');

        tier
          .append('path')
          .style('fill', `rgba(0, 50, 50, ${ambience})`)
          .attr('d', h);
        hierarchyPlates.append(_ => tier.node())

        radius += tierHeight;
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
          d => `rotate(${d.idx * 360/12} 0 0) translate(0 -47) scale (1, ${this.options.maxWidth+2})`
        );

      this.canvas.append(_ => demarcationGroup.node())
    }

    if (events.length) {
      const eventItem = d3.arc()
        .innerRadius(d => innerShellRadius + d.tier * tierHeight)
        .outerRadius(d => innerShellRadius + (d.tier+1) * tierHeight)
        .startAngle(d => {

          if (d.range) {
            return Utils.degToRad(
              Utils.dateToDegreeAngle(new Date(d.range.from))
            );
          }

          if (d.date) {
            return Utils.degToRad(
              Utils.dateToDegreeAngle(new Date(d.date))
            );
          }

          return 0;
        })
        .endAngle(d => {
          if (d.range) {
            return Utils.degToRad(
              Utils.dateToDegreeAngle(new Date(d.range.to))
            );
          }

          if (d.date) {
            return Utils.degToRad(
              Utils.dateToDegreeAngle(new Date(d.date)) +
                (360/12) / Utils.getMaxDaysInMonth(new Date(d.date))
            );
          }

          return 0;
        });

      const eventsGroup = d3.create('svg:g');

      eventsGroup
        .selectAll('g')
        .data(events.map((e, idx) => ({...e, idx})))
        .enter()
        .append('g')
        .call(element => {
          const _this = this;

          element.append('path')
            .attr('id', d => `event_${d.idx}`)
            .attr('fill', d =>
              `rgba(255, 87, 34, ${1 - d.tier/(2*this.options.hierarchies)})`)
            .attr('class', 'event-item')
            .on('mousemove', _this.options.tooltipEnterCallback)
            .on('mouseleave', _this.options.tooltipLeaveCallback)
            .attr('d', eventItem);
        });

      this.canvas.append(_ => eventsGroup.node());
    }

    if (this.options.showClockHand) {
      const r = this.options.maxWidth + 43;
      const theta = Utils.dateToDegreeAngle(new Date());

      const tickHand = Needle.getNeedle(r, 'rgba(0, 35, 35)');
      tickHand.attr('transform', `rotate(${theta})`)
      this.canvas.append(_ => tickHand.node());
    }

    return this.canvas.node();
  }
}
