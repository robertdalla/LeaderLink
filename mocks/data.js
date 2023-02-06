var lodash = require('lodash');
var faker = require('faker');
var sharePoint = require('./_sharePoint.json');
var snap = require('./_snap.json');
var bidw = require('./_bidw.json');
var successFactors = require('./_successFactors.json');
var sap = require('./_sap.json');
var users = require('./_users.json');

const evalFakers = (obj) => {
  if (lodash.isArray(obj)) {
    obj.forEach(evalFakers);
  } else {
    Object.keys(obj).forEach(key => {
      if (lodash.isArray(obj[key])) {
        obj[key].forEach(evalFakers);
      } else if (lodash.isString(obj[key]) && obj[key].startsWith('faker')) {
        try {
          obj[key] = eval(obj[key]);
        } catch{ }
      }
    })
  }
}

evalFakers(snap);
evalFakers(bidw);
evalFakers(successFactors);
evalFakers(sap);
evalFakers(users);

module.exports = () => {
  return {
    ...sharePoint,
    ...snap,
    ...bidw,
    ...successFactors,
    ...sap,
    ...users
  };
}
