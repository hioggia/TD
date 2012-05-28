var objectId = 0;
var objectIndex = [];

var time = 0;

var map = {};

/*

*/
function WorldObject(){
    this.id = objectId ++;
    objectIndex[this.id] = this;
}