'use strict';
export default class Router {
  constructor() {
    this.params = {
      'zoom': 0,
      'lng': 0,
      'lat': 0
    }
  }

  getRoutingResults() {
    let currentRouting = [];
    let results = {
      zoom: (zoom) => {
        return zoom && zoom !== 0
      },
      lng: (lng) => {
        return lng && lng !== 0
      },
      lat: (lat) => {
        return lat && lat !== 0
      }
    };

    for (var key in results) {
      currentRouting.push(results[key](this.getQueryVariable(key)));
    }

    return currentRouting;
  }

  loadURLRouting() {
    var currentRouting = this.getRoutingResults();
    console.log(currentRouting);

    if (currentRouting[currentRouting.length - 1]) {
      return currentRouting[currentRouting.length - 1];
    } else {
      return null;
    }
  }

  getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        if (pair[1] !== '') {
          return pair[1];
        }
      }
    }

    return (false);
  }

  updateURLParams(newParams) {
    for (var item in newParams) {
      if (this.params.hasOwnProperty(item)) {
        this.params[item] = newParams[item];
      }
    }

    var newTempURL = '';

    for (var property in this.params) {
      if (this.params.hasOwnProperty(property)) {
        switch (true) {
          case property !== 0:
            newTempURL += property + '=' + this.params[property] + '&';
            break;
          default:

        }
      }
    }

    if (history.pushState) {
      var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + newTempURL;
      window.history.pushState({
        path: newurl
      }, '', newurl);
    }
  }
}
