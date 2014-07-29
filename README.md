#Css Spriter

Usage
==========
Usage: cssspriter -i <file ...> -o <file ...>

Options:

  -h, --help                       output usage information
  -V, --version                    output the version number
  -i,--inputs [file inputs]        input css files, split with ","
  -o,--outputs [file outputs]      output css files, split with ","
  -d , --dir [sprite image dir]    output sprite image dir
  -f , --file [sprite image file]  output sprite image file


==========
### css
sprite-image:"image.png"
sprite-width:50
sprite-height:30
sprite-margin-top:10
sprite-margin-bottom:2
sprite-margin-left:3
sprite-margin-right:4
sprite-align:right

example
==========
### test.css
    .download .normal{
        sprite-image:download-up.png;
        sprite-margin-top:2px;
        sprite-margin-bottom:2px;
        sprite-margin-right:30px;
    }
    .download .hover{
        sprite-image:download-over.png;
        sprite-margin-top:2px;
        sprite-margin-bottom:2px;
        sprite-margin-right:30px;
    }
    .download .down{
        sprite-image:download-down.png;
        sprite-margin-top:2px;
        sprite-margin-bottom:2px;
        sprite-margin-right:30px;
    }
    .play .normal{
        sprite-image:play-up.png;
        sprite-align:right;
        sprite-margin-top:1px;
        sprite-margin-bottom:1px;
        sprite-margin-left:120px;
    }
    .play .hover{
        sprite-image:play-over.png;
        sprite-align:right;
        sprite-margin-top:1px;
        sprite-margin-bottom:1px;
        sprite-margin-left:120px;
    }
    .play .down{
        sprite-image:play-down.png;
        sprite-align:right;
        sprite-margin-top:1px;
        sprite-margin-bottom:1px;
        sprite-margin-left:120px;
    }

### compile
    cssspriter -i test.css