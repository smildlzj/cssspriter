var fs = require('fs');

function load(fileName){
    if(!fs.existsSync(fileName)){
        return null;
    }
    return fs.readFileSync(fileName);
}

function write(fileName , content){
    fs.writeFileSync(fileName , content);
}

function exist(fileName){
    return fs.existsSync(fileName);
}


exports.load = load;
exports.write = write;
exports.exist = exist;