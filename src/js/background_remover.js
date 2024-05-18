const c = document.getElementById("game");
const ctx = c.getContext("2d");

const fileElement = document.getElementById("file")

var image, width, height;

fileElement.addEventListener("change", handleFiles);

function handleFiles(e){
    var image = document.createElement("img");
    image.src = URL.createObjectURL(e.target.files[0]);
    image.onload = function() {
        ctx.drawImage(image, 0, 0);
        width = this.width;
        height = this.height;
    }
}

function calculate(){
    color = hexToRgb(document.getElementById("color").value);
    var variation = parseInt(document.getElementById("variation").value);
    var imageData = ctx.getImageData(0, 0, width, height);
    var data = imageData.data;
    for(var i = 0; i < data.length; i += 4){
        if(inRange(data[i], color.r, variation) && inRange(data[i + 1], color.g, variation) && inRange(data[i + 2], color.b, variation)){
            data[i + 3] = 0;
        }
    }
    imageData.data = data;
    ctx.clearRect(0, 0, width, height);
    ctx.putImageData(imageData, 0, 0);
}

function inRange(num1, num2, variation){
    if((num1 - variation <= num2 && num2 <= num1 + variation) || num1 == num2){
        return true;
    }else{
        return false;
    }
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}