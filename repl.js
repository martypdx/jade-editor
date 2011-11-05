var __ = { lineno: 1, input: "p Hello #{place}\nscope true\n  p Hello #{place}", filename: undefined };
try {
    var buf = [];
    with (locals || {}) {
        var interp;
        __.lineno = 1;
        __.lineno = 1;
        buf.push('<p>Hello ' + escape((interp = place) == null ? '' : interp) + '');
        __.lineno = undefined;
        buf.push('</p>');
        __.lineno = 3;
        // scope true
        (function(){
            with (true) {
                __.lineno = 2;
                __.lineno = 3;
                buf.push('<p>Hello ' + escape((interp = place) == null ? '' : interp) + '');
                __.lineno = undefined;
                buf.push('</p>');
            }
        }).call(this);
    
    }
    return buf.join("");
}
catch (err) {
  rethrow(err, __.input, __.filename, __.lineno);
}