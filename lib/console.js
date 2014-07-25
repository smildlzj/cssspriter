var options = require("./options").options;

function info(msg){
    console.info.apply(console, arguments);
}
function debug(msg){
    console.log('[DEBUG]', +new Date, msg);
}
function log(msg){
    console.log.apply(console, arguments);
}


exports.debug = debug;
exports.info = info;
exports.log = log;