var x = function() {
    var messageToTheWorld = 'Hello ' + this.message;
    var that = this;
    function print() {
        console.log(this); // this will be DOMWindow
        console.log(that); // that will be the object y
        console.log(messageToTheWorld);
    }
    
    return print();
};
    
var y = { message: 'World'};
x.apply(y, []);