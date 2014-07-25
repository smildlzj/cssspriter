var io = require('./io');

function load(conf){
    return require(conf);
}

exports.options = {
    debug : true
};