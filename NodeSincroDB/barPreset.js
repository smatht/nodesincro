const _colors = require('colors');
 
module.exports = {
    format: '{tabla}:' + _colors.cyan(' {bar}') + ' {percentage}% | ETA: {eta}s | {value}/{total}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591'
};