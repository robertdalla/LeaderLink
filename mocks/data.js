const lodash = require('lodash');
const faker = require('faker');

let snap = require('./_snap.json');
let bidw = require('./_bidw.json');
let successFactors = require('./_successFactors.json');
let sap = require('./_sap.json');
let users = require('./_users.json');
let sharePoint = require('./_sharePoint.json');

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
