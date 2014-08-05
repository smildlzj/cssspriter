var fs = require('fs'),
    path = require('path'),
    PNG = require('pngjs').PNG,
    packer  = require('./GrowingPacker'),
    io = require('./io'),
    css = require('./css'),
    data = require("./data"),
    console = require("./console");

function info(fileName , value , onSkip , onDone) {

    if ( data.images(fileName , value) ){
        //读取图片width,height等
        _read(fileName , function(obj){
            var im = data.images(fileName);
            im.image = obj.image;

            if(im.w){
                im.ml = im.mr = (im.w - obj.width)/2;
            }else{
                im.w = obj.width + im.ml + im.mr;
            }

            if(im.h){
                im.mt = im.mb = (im.h - obj.height)/2;
            }else{
                im.h = obj.height + im.mt + im. mb;  
            }
            
            if(typeof(onDone) == "function")onDone(obj);
        });
        return;
    }

    if(typeof(onSkip) == "function")onSkip();

};

/**
 * 读取单个图片的内容和信息
 * @param {String} fileName
 * @param {Function} callback callback(ImageInfo)
 * { // ImageInfo
 *     image: null, // 图片数据
 *     width: 0,
 *     height: 0,
 *     size: 0 // 图片数据的大小
 * }
 */
function _read(fileName, callback){

    fs.createReadStream(fileName).pipe(new PNG())
        .on('parsed', function() {

            var imageInfo = {
                image: this,
                width: this.width,
                height: this.height
            };
            callback(imageInfo);

        })
        .on('error', function(e){
            info('>>Skip: ' + e.message + ' of "' + fileName + '"');
            callback(null);
        });
}

function sprite(array , fileName){

    var root,
        _createPng = function(width , height){
            var png = new PNG({
                width: width,
                height: height
            });

            /*
             * 必须把图片的所有像素都设置为 0, 否则会出现一些随机的噪点
             */
            for (var y = 0; y < png.height; y++) {
                for (var x = 0; x < png.width; x++) {
                    var idx = (png.width * y + x) << 2;

                    png.data[idx] = 0;
                    png.data[idx+1] = 0;
                    png.data[idx+2] = 0;

                    png.data[idx+3] = 0;
                }
            }
            return png;
        },
        _gp = function(arr){
            var packer = new GrowingPacker(1000, 1000);
            /* 
             * packer 算法需要把最大的一个放在首位...
             * 排序算法会对结果造成比较大的影响
             */
            arr.sort(function(a, b){
                return b.w * b.h - a.w * a.h;
            });
            // 用 packer 对数组元素进行定位
            packer.fit(arr);
            /* 
             * root 的值就是 packer 定位的结果
             * root.w / root.h 表示图片排列后的总宽高
             * 各个小图片的坐标这在 arr 的元素中, 新增了一个 fit 属性
             * fit.x / fit.y 表示定位后元素的坐标
             */
            return packer.root;
        };



    this.setPosition = function(){
        var arrays = [[] , []];//0:left 1:right

         //将靠右对齐的图片分离出来
        array.forEach(function(item){
            if(item.align == "right"){
                arrays[1].push(item);
            }else{
                arrays[0].push(item);
            }
        });

   
        //定位左对齐的图片
        var leftRoot = _gp(arrays[0]);

        //对靠右对齐的图片处理
        var rightRoot = {
            w : 0,
            h : 0
        };

        //计算右切片大小
        var _last_mb = 0;
        arrays[1].forEach(function(item){
            rightRoot.w = Math.max(rightRoot.w , item.w);
            rightRoot.h += Math.max(_last_mb , item.mt) + item.image.height;
            _last_mb = item.mb;
        });

        //得到左右切片的布局方式
        root = _gp([
            {w : leftRoot.w , h : leftRoot.h},
            {w : rightRoot.w , h : rightRoot.h}
        ]);



        //定位右对齐的图片
        _last_mb = 0;
        var _h = (root.h == (leftRoot.h + rightRoot.h)  ? leftRoot.h : 0);
        arrays[1].forEach(function(item){
            if(_last_mb > item.mt)_h += (_last_mb - item.mt);
            item.fit = {
                x : root.w - item.w,
                y : _h
            };
            _h += item.mt + item.image.height;
            _last_mb = item.mb;
        });
    };

    this.create = function(){
        var png = _createPng(root.w , root.h);
        array.forEach(function(obj){
            // 对图片进行填充
            obj.image.bitblt(png, 0, 0, obj.image.width, obj.image.height, 
                    obj.fit.x + obj.ml, obj.fit.y + obj.mt);
            obj.spriteName = path.resolve(fileName);
        });

         png.pack()
            .pipe(fs.createWriteStream(fileName))
            .on('finish', function(){

             });


    };

    this.setPosition();
    this.create();
};



function create(file){
    new sprite(data.images() , file);
};

exports.info = info;
exports.create = create;