var moment = require('moment');
var _ = require('lodash');

const Helpers = {
  xDaysAgo: function(int) {
    return moment().subtract(int, 'days').toISOString().slice(0,10)
  }
}

export default Helpers;
