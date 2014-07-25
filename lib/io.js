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

exports.load = load;
exports.write = write;