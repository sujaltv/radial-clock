class Utils {
  static degToRad(degrees) {
    return degrees * Math.PI / 180;
  }

  static getMaxDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  }

  static dateToDegreeAngle(date) {
    const day = date.getDate();
    const month = date.getMonth();

    const maxDaysInMonth = Utils.getMaxDaysInMonth(date);

    const sectorAngle = 360/12
    const monthAngle = month * sectorAngle;

    const dayAngle = day * sectorAngle / maxDaysInMonth;

    return monthAngle + dayAngle;
  }
}