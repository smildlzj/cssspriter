var 
    path = require('path'),
    css = require("./lib/css"),
    io = require("./lib/io"),
    history = require("./lib/history");


//main
//css.add("test1/t.css");
//css.process();

var process = function(file){
    var dir;
    if(!file){
        //当前目录
        dir = path.resolve(".") + "/";
        console.log(dir);
        file =  history.load(dir).spriteImgName;
    }else if(io.isDirectory(file)){
        //指定目录
        dir = file + "/";
        file =  history.load(dir).spriteImgName;
    }

    //未指定文件名,自动生成
    if(!file){
        for(var i = 1 ;;i++){
            file = dir + "sprite"+i+".png";
            if(!io.exist(file)){
                break;
            }
        }
    }else{
        file = dir + file;
    }

    css.process(file);

    //保存历史记录
    history.save({
        spriteImgName : path.relative(dir , file)
    });
};

exports.add = css.add;
exports.process = process;