class Needle {
  static getNeedle(length, colour='orange') {
    const pivot = d3.arc()
      .innerRadius(0)
      .outerRadius(2)
      .startAngle(0)
      .endAngle(Utils.degToRad(360));

    const shaft = d3.line(0, 0)([[0,0], [0,-1]]);

    const arrowHead = d3.path();
    arrowHead.moveTo(0, -1)
    arrowHead.lineTo(0.4, 0)
    arrowHead.quadraticCurveTo(0, -0.4, -0.4, 0);
    arrowHead.lineTo(0, -1)
    arrowHead.closePath();

    const needle = d3.create('svg:g');

    needle
      .append('g')
      .call(element => {
        element.append('path')
          .attr('d', arrowHead)
          .attr('transform', `translate(0 -${length-5}) scale(12)`)
          .attr('fill', colour);

        element
          .append('path')
          .attr('d', shaft)
          .attr('transform', `scale(1 ${length})`)
          .attr('stroke', colour)
          .attr('stroke-width', '2px');

        element.append('path')
          .attr('d', pivot)
          .attr('stroke', colour)
          .attr('fill', colour)
          .attr('stroke-width', '2px');
      });

    return needle;
  }
}