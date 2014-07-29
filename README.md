#Css Spriter

Usage
==========
### Command-line usage
    Usage: cssspriter -i file ... -o file ...

    Options:
      -h, --help                       output usage information
      -V, --version                    output the version number
      -i,--inputs [file inputs]        input css files, split with ","
      -o,--outputs [file outputs]      output css files, split with ","
      -d , --dir [sprite image dir]    output sprite image dir
      -f , --file [sprite image file]  output sprite image file

### Usage in Code
    var cssspriter = require('cssspriter');
    cssspriter.init();
    cssspriter.add(input_css_file_name , output_css_file_name);
    cssspriter.process(output_sprite_image_dir);


==========
### css
    sprite-image:String

    sprite-width:Number

    sprite-height:Number

    sprite-margin-top:Number

    sprite-margin-bottom:Number

    sprite-margin-left:Number

    sprite-margin-right:Number

    sprite-align:[left/right]

example
==========
### test.css
    .download .normal{
        sprite-image:"download-up.png";
        sprite-margin-top:2px;
        sprite-margin-bottom:2px;
        sprite-margin-right:30px;
    }
    .download .hover{
        sprite-image:"download-over.png";
        sprite-margin-top:2px;
        sprite-margin-bottom:2px;
        sprite-margin-right:30px;
    }
    .download .down{
        sprite-image:"download-down.png";
        sprite-margin-top:2px;
        sprite-margin-bottom:2px;
        sprite-margin-right:30px;
    }
    .play .normal{
        sprite-image:"play-up.png";
        sprite-align:right;
        sprite-margin-top:1px;
        sprite-margin-bottom:1px;
        sprite-margin-left:120px;
    }
    .play .hover{
        sprite-image:"play-over.png";
        sprite-align:right;
        sprite-margin-top:1px;
        sprite-margin-bottom:1px;
        sprite-margin-left:120px;
    }
    .play .down{
        sprite-image:"play-down.png";
        sprite-align:right;
        sprite-margin-top:1px;
        sprite-margin-bottom:1px;
        sprite-margin-left:120px;
    }

### compile
    cssspriter -i test.css