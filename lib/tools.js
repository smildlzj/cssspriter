function metux(size){
    var index = 0,
        callback;

    this.next = function(){
        if(++index >= size){
            callback && callback();
        }

    }

    this.onDone = function(fun){
        if(index >= size){
            fun();
        }else{
            callback = fun;
        }
    };
}

exports.metux = metux;