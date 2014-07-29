var 
    path = require('path'),
    CSSOM = require('cssom'),
    data = require("./data"),
    image = require("./image"),
    metux = require("./tools").metux,
    io = require("./io"),
    console = require("./console");


var files = {};

function _load(fileName) {
    if(fileName in files){

        return files[fileName];
    }
    
    var content = io.load(fileName);
    if(!content) return null;

    var styleSheet = CSSOM.parse(content.toString());
    files[fileName] = styleSheet;
    return styleSheet;
};

var _metux;


function add(fileName , outputFileName){
    fileName = path.resolve(fileName);

    //当前目录
    var dir = path.dirname(fileName);

    data.css.push({
        input : fileName,
        output : outputFileName || dir + "/sprite_"+ path.basename(fileName)
    });
    

    //索引图片信息
    var array = _load(fileName).cssRules;
    _metux = new metux(array.length);
    array.forEach(function(item){
        var img = item.style["sprite-image"];
        if(!img){
            _metux.next();
            return;
        }

        img = img.replace(/["']/g , "");

        img = path.join(dir , img);
        image.info(img , {
            w : parseInt(item.style["sprite-width"] , 10) || 0,
            h : parseInt(item.style["sprite-height"] , 10) || 0,
            mt : parseInt(item.style["sprite-margin-top"] , 10) || 0,
            mr : parseInt(item.style["sprite-margin-right"] , 10) || 0,
            mb : parseInt(item.style["sprite-margin-bottom"] , 10) || 0,
            ml : parseInt(item.style["sprite-margin-left"] , 10) || 0,
            align : item.style["sprite-align"] || "left"
        } , _metux.next , _metux.next);
    });

};

function exportCss(){
    data.css.forEach(function(unit){
        var fileName = unit.input;
        var dir = path.dirname(fileName);
        var array = _load(fileName).cssRules;
        var combineRule = {};
        var cssText = [];
        array.forEach(function(item){
            var 
                style = item.style,
                img = style["sprite-image"];
            if(!img){
                return;
            }

            //remove
            style.removeProperty('sprite-image');
            style.removeProperty('sprite-margin-top');
            style.removeProperty('sprite-margin-bottom');
            style.removeProperty('sprite-margin-left');
            style.removeProperty('sprite-margin-right');
            style.removeProperty('sprite-align');
            style.removeProperty('sprite-width');
            style.removeProperty('sprite-height');
            style.removeProperty('background-image');

            img = path.join(dir , img);

            var obj = data.images(img);
            //set
            style.setProperty('background-position' , 
                (obj.align == "right" ? "right" : (obj.fit.x > 0 ? -obj.fit.x+"px" : 0) )
                +" "+
                (obj.fit.y > 0 ? -obj.fit.y+"px" : 0),
                null
            );

            cssText.push(item.cssText);

            (obj.spriteName in combineRule) 
                ? combineRule[obj.spriteName].push(item.selectorText) 
                : combineRule[obj.spriteName] = [item.selectorText];
        });

        
        for(simg in combineRule){
            cssText.push(combineRule[simg].join(",\n") +
                "{background-image:url("+path.relative(dir,simg).replace(/\\/g,"/")+")" +
            "}");
        }
        io.write(unit.output , cssText.join("\n"));
        //console.debug(cssText.join("\n"));

    });
}


function process(file){
    //_metux.onDone(image.create);
    //
    _metux.onDone(function(){
        image.create(file);
        exportCss();

        //for debug
        //_debug();
            
    });
};

function _debug(){
   data.images().forEach(function(image){
        var p = [];
        if(image.align == "right"){
            p.push(image.align);
        }else{
            p.push(-image.fit.x);
        }
        p.push(-image.fit.y);
        console.debug(image.path + ": \t"+p.join("\t"));
    }); 
}

exports.add = add;
exports.process = process;