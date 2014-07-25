var fs = require('fs'),
    path = require('path'),
    css = require("./lib/css"),
    io = require("./lib/io");


//main
css.add("test1/t.css");
css.process();
