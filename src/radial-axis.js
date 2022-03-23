/**
 * This class returns a radial axis with labels specified in the
 * <code>ticks</code> property.
 */
class RadialAxis {
  static ticks = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'Spetember', 'October', 'November', 'December'
  ];

  /**
   * Creates a radial axis.
   * @param {int} innerRadius Radius of the inner side of a axis.
   * @param {int} outerRadius Radius of the outer side of the axis.
   */
  constructor(innerRadius, outerRadius) {
    this.uid = new Date().getUTCMilliseconds();

    this.ring = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(d => Utils.degToRad((360 / 12) * d.idx))
      .endAngle(d => Utils.degToRad((360 / 12) * (d.idx + 1)));
  }

  getMonthAxis(fullLabels=false, x=5, dy=10) {
    this.root = d3.create('svg:g');

    this.root.selectAll('g')
      .data(RadialAxis.ticks.map((month, idx) => ({month, idx})))
      .enter()
        .append('g')
          .call(element => {
            element
              .append('path')
              .attr('d', this.ring)
              .attr('id', d => `monthAxisTick_${this.uid}_${d.idx}`);

            element
              .append('text')
              .attr('x', x)
              .attr('dy', dy)
                .append('textPath')
                .attr('xlink:href', d => `#monthAxisTick_${this.uid}_${d.idx}`)
                .text(d => {
                  let monthName = d.month.toUpperCase();
                  if (!fullLabels) monthName = monthName.substring(0,3);
                  return monthName;
                })
                .style('font-size', '5pt')
                .style('letter-spacing', '1pt');
            });
  }

  /**
   * This method adds a string of text on the axis.
   * @param {String} script Text to render on the axis
   * @param {int} dyOffset Offset from the y axis
   * @param {int} fontSize Size of the text
   * @param {int} textLength Maximum text width
   */
  addScript(script, dyOffset=15, fontSize=10, textLength=30) {
    this.root
      .append('text')
      .text(script)
      .attr('textLength', `${textLength}px`)
      .attr('x', '0')
      .attr('y', '0')
      .attr('dy', dyOffset)
      .attr('dominant-baseline', 'middle')
      .attr('text-anchor', 'middle')
      .style('font-size', `${fontSize}pt`);
  }
}
