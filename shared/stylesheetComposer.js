/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-param-reassign */

const composer = function composer(base, extensions) {
  return extensions.reduce(function (result, baseStyle) {
    return Object.keys(baseStyle).reduce(function (subResult, k) {
      if (subResult[k] && baseStyle[k]) {
        subResult[k] = subResult[k].split(' ').concat(baseStyle[k].split(' ')).join(' ');
      }

      return subResult;
    }, result);
  }, base);
};

/* eslint-enable func-names */
/* eslint-enable prefer-arrow-callback */
/* eslint-enable no-param-reassign */

exports.default = composer;
