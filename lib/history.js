var 
    crypto = require("crypto"),
    path = require('path'),
    io = require("./io"),
    data = require("./data"),
    fileName = ".sprite_history",
    workspace,
    config,
    key;


    var load = function(dir){
        workspace = dir;
        config = JSON.parse(String(io.load(dir + fileName) || "{}"));
        key = getKey();

        return config[key] || {};
    };

    var save = function(options){
        if(data.css.length == 0)return;
        var files = [];
        data.css.forEach(function(obj){
            files.push(path.relative(workspace , obj.input));
        });
        options.files = files;
        config[key] = options;
        io.write(workspace + fileName , JSON.stringify(config));
    };

    var getKey = function(){
        if(data.css.length == 0)return null;
        var md5sum = crypto.createHash('md5');
        var copy = data.css.slice(0);
        copy.sort(function(a , b){
            return a.input - b.input;
        });

        copy.forEach(function(obj){
            md5sum.update(obj.input);
        });

        return md5sum.digest('hex');
    };



exports.load = load;
exports.save = save;