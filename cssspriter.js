var 
    path = require('path'),
    css = require("./lib/css"),
    io = require("./lib/io"),
    data = require("./lib/data"),
    history = require("./lib/history");


//main
//css.add("test1/t.css");
//css.process();

var init = function(){
    data.css.length = 0;
    data.images.clear();
}

var process = function(file){
    var dir;
    if(!file){
        //当前目录
        dir = path.resolve(".") + "/";
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
exports.init = init;
exports.add = css.add;
exports.process = process;
