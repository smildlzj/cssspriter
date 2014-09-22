var 
    path = require('path'),
    CSSOM = require('cssom'),
    data = require("./data"),
    image = require("./image"),
    metux = require("./tools").metux,
    io = require("./io"),
    console = require("./console");

var css_start_info = "/*sprite start*/",
    css_end_info = "/*sprite end*/";


var _files = {};
function _load(fileName) {
    if(fileName in _files){

        return _files[fileName];
    }
    
    var content = io.load(fileName);
    if(!content) return null;
    content = _files[fileName] = content.toString();
    return content;
};

var _css_dom = {};
//识别包含sprite-image的注释
var _regex = new RegExp("/(\\*+)((?:(?!\\*/)[\\s\\S])*sprite\\-image(?:(?!\\*/)[\\s\\S])*)(\\*+)/" , "gi");
function _get(fileName){
    if(fileName in _css_dom){

        return _css_dom[fileName];
    }

    var content = _load(fileName);
    if(!content) return null;

    content = content.replace(_regex , function(all , start, body , end){
        var str = [" "];
        for(var i = 0 , len = start.length ; i < len ; i++)str.push(" ");
        str.push(body);
        for(var i = 0 , len = end.length ; i < len ; i++)str.push(" ");
        str.push(" ")
        return str.join("");
    });

    var p1 = content.indexOf(css_start_info);
    if(p1 != -1){
        var p2 = content.indexOf(css_end_info , p1);
        content = content.substring(0 , p1) 
                + content.substring(p2 + css_end_info.length);
    }

    //console.log(content);
    var styleSheet = CSSOM.parse(content);
    _css_dom[fileName] = styleSheet;
    return styleSheet;
}

var _metux;


function add(fileName , outputFileName){
    fileName = path.resolve(fileName);

    //跳过无效
    var content = _load(fileName);
    if(!content || content.indexOf("sprite-image") == -1){
        return;
    }


    //当前目录
    var dir = path.dirname(fileName);

    data.css.push({
        input : fileName,
        output : outputFileName || dir + "/sprite_"+ path.basename(fileName)
    });
    

    //索引图片信息
    var array = _get(fileName).cssRules;
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
        var array = _get(fileName).cssRules;
        var content = _load(fileName);
        var combineRule = {};
        var output = [];
        var lastEnd = 0;
        var css_piece;
        array.forEach(function(item){
            var 
                style = item.style,
                img = style["sprite-image"];
            //
            output.push(content.substring(lastEnd , item.__starts));

            css_piece = content.substring(item.__starts , item.__ends);
            if(!img){
                output.push(css_piece);
                lastEnd = item.__ends;
                return;
            }
            lastEnd = item.__ends;

        
            img = img.replace(/["']/g , "");

            //remove background-image
            css_piece = css_piece.replace(/\s*background-image\s*:.*?;[\s\n\r]*/g , "");
            css_piece = css_piece.replace(/\s*background-position\s*:.*?;[\s\n\r]*/g , "");

            img = path.join(dir , img);

            var obj = data.images(img);
            if(!obj){
                output.push(css_piece);
                console.error("cant find "+img);
                return;
            }
            //set
            css_piece = css_piece.substring(0 , css_piece.length-1) 
                + "    background-position:"
                + (obj.align == "right" ? "right" : (obj.fit.x > 0 ? -obj.fit.x+"px" : 0) )
                +" "+ (obj.fit.y > 0 ? -obj.fit.y+"px" : 0)
                +";\n" + css_piece.substring(css_piece.length -1);
            

            output.push(css_piece);

            (obj.spriteName in combineRule) 
                ? combineRule[obj.spriteName].push(item.selectorText) 
                : combineRule[obj.spriteName] = [item.selectorText];
        });

        //将剩下的放入
        output.push(content.substring(lastEnd));

        var sprite_css = [css_start_info];
        for(simg in combineRule){
            sprite_css.push(combineRule[simg].join(",\n") +
                "{background-image:url("+path.relative(dir,simg).replace(/\\/g,"/")+")" +
            "}");
        }
        sprite_css.push(css_end_info);
        output.push("\n"+sprite_css.join("\n"));
        io.write(unit.output , output.join(""));
        //console.debug(output.join(""));

    });
}


function process(file , direction){
    //_metux.onDone(image.create);
    //
    if(_metux){
        _metux.onDone(function(){
            image.create(file , direction);
            exportCss();
            _files = {};
            _css_dom = {};
            //for debug
            //_debug();
                
        });
    }
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