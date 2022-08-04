class Browser {
  static isFirefox() {
    return navigator.userAgent.includes('Firefox');
  }

  static isChrome() {
    return navigator.userAgent.includes('Chrome');
  }

  static isSafari() {
    return navigator.userAgent.includes('Safari') &&
      !Browser.isChrome() && !Browser.isFirefox();
  }
}

class FileUtils {
  static saveContentAsFile(content, fileName) {
    const downloader = document.createElement('a');
    downloader.href = content;
    downloader.download = fileName;
    downloader.click();
    downloader.remove();
  }
}