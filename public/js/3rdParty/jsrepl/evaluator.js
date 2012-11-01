function Evaluator(cons) {
    this.env = {};
    this.cons = cons;
}
Evaluator.prototype.evaluate = function (str) {
    try {
        str = Evaluator.rewriteDeclarations(str);
        var __environment__ = this.env;
        var console = this.cons;
        with (__environment__) {
            return JSON.stringify(eval(str));
        }
    } catch (e) {
        return e.toString();
    }
};
Evaluator.rewriteDeclarations = function (str) {
    // Prefix a newline so that search and replace is simpler
    // (remove it before returning the result)
    str = "\n" + str;
    
    str = str.replace(/\nvar\s+(\w+)\s*=/g, "\n__environment__.$1 =");
    str = str.replace(/\nfunction\s+(\w+)/g, "\n__environment__.$1 = function");
    
    return str.slice(1);
}