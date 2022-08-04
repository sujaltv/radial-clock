class REST {
  static get(url) {
    return new Promise((resolve, reject) => {
      const handleResponse = ({target}) => {
        if (target.status === 200)
          resolve(target.response);
        else reject(target.status);
      }

      const requester = new XMLHttpRequest();
      requester.addEventListener('load', handleResponse);
      requester.open('GET', url);
      try {
        requester.send();
      }
      catch (e) {
        reject(e);
      }
    });
  }
}