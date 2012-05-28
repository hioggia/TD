
function WorldView(world) {
    for(var y = world.area.top;y<world.area.bottom; y++) {
        for(var x = world.area.left;x<world.area.right; x++) {
            var div = document.createElement("div");
            div.style.outline = "solid 1px green";
            div.style.height = "30px";
            div.style.width = "30px";
            div.style.position = "absolute";
            div.style.top = 30*y + "px";
            div.style.left = 30*x + "px";
            document.body.appendChild(div);
        }
    }
}