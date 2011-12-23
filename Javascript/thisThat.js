var x = function() {
    var messageToTheWorld = 'Hello ' + this.message;
    var that = this;
    function print() {
        console.log(this);
        console.log(that);
        console.log(messageToTheWorld);
    }
    
    return print();
};
    
var y = { message: 'World'};
x.apply(y, []);