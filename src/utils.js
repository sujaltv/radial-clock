class Utils {
  static degToRad(degrees) {
    return degrees * Math.PI / 180;
  }

  static radToDeg(radians) {
    return radians * 180 / Math.PI;
  }

  static getMaxDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  static randotron(width) {
    return Math.round(Math.random() * 10 ** (width+1));
  }

  static dayToDegreeAngle(date, numSectors=31) {
    const day = date.getDate();

    const sectorAngle = 360/numSectors

    return day * sectorAngle;
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

  static svgToBlob(svgElement) {
    const serialiser = new XMLSerializer();
    const source = `<?xml version="1.0" standalone="no"?>
      ${serialiser.serializeToString(svgElement)}
    `;
    return new Blob([source], { type: 'image/svg+xml' });
  }

  static blobToBase64(blob) {
    return new Promise(resolve => {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = e => {
        console.log('Loading blob to convert to base64 failed', e);
      }
      fileReader.readAsDataURL(blob);
    });
  }

  static svgToString(svgElement) {
    return Utils.blobToBase64(Utils.svgToBlob(svgElement));
  }

  static async svgToPng(svgElement, scale=2) {
    return new Promise(async resolve => {
      const image = new Image(200,200);
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = svgElement.width.baseVal.value * scale;
        canvas.height = svgElement.height.baseVal.value * scale;

        const context = canvas.getContext('2d');

        context.drawImage(image, 0, 0);

        resolve(canvas.toDataURL());
      };
      image.onerror = e => {
        console.log('Loading svg to image failed', e);
      }

      image.src = await Utils.blobToBase64(Utils.svgToBlob(svgElement));
    });
  }
}
