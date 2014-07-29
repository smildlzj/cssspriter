function array(){};
//继承Array
array.prototype = [];

(function(){
    var _push = Array.prototype.push;

    //重写Array,增加判断唯一功能,类似ES6的Set
    array.prototype.push = function(obj){
        if(this.indexOf(obj) != -1){
            return;
        }else{
            _push.apply(this , arguments);
        }
    };
})();


function images(key , value){

    var thix = images;

    switch(arguments.length){
        case 0:
            return thix._array;
        case 1:
            return thix._map[key];
    };

     if(key in thix._map)
    {
        var item = thix._map[key];
        item.mt = Math.max(item.mt , value.mt);
        item.mr = Math.max(item.mr , value.mr);
        item.mb = Math.max(item.mb , value.mb);
        item.ml = Math.max(item.ml , value.ml);
        //right强制布局
        item.align = (value.align == "right" ? "right" : item.align);
        return false;
    }else{
        value.path = key;
        thix._map[key] = value;
        thix._array.push(value);
        return true;
    }
};

images._map = {};
images._array = [];
images.extends = function(key , options){
    var thix = images,
        item = thix._map[key];
    for(var k in options){
        item[k] = options[k];
    }

};
images.clear = function(){
    images._map = {};
    images._array.length = 0;
};

exports.images = images;
exports.css = new array();