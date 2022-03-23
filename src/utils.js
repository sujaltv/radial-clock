class Utils {
  static degToRad(degrees) {
    return degrees * Math.PI / 180;
  }

  static getMaxDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  static randotron(width) {
    return Math.round(Math.random() * 10 ** (width+1));
  }

  static dateToDegreeAngle(date, numSectors=12) {
    const day = date.getDate();
    const month = date.getMonth();

    const maxDaysInMonth = Utils.getMaxDaysInMonth(date);

    const sectorAngle = 360/numSectors
    const monthAngle = month * sectorAngle;

    const dayAngle = day * sectorAngle / maxDaysInMonth;

    return monthAngle + dayAngle;
  }

  static svgToString(svgElement) {
    const serialiser = new XMLSerializer();
    let source = '<?xml version="1.0" standalone="no"?>\r';
    source += serialiser.serializeToString(svgElement);
    source = 'data:image/svg+xml;charset=utf-8,' + source;
    return source;
  }
}
