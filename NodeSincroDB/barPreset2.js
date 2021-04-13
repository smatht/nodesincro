const _colors = require('colors');
 
module.exports = {
    format: '{tabla}:' + _colors.dim(' {bar}') + ' {percentage}% | ETA: {eta}s ',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591'
};