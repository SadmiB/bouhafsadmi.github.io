document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById('fire');
    var ctx = canvas.getContext('2d');
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var intensity = null;
    var fps = 30;
    var threshold = 0.5;
    var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    var data = imageData.data;
    
    var colors = [];
    
    for (var i = 0; i < 256; i++) {
        var color = [];
        color[0] = color[1] = color[2] = 0;
        colors[i] = color;
    }
    
    for (var i = 0; i < 32; ++i) {
        colors[i][2] = i << 1;
        colors[i + 32][0] = i << 3;
        colors[i + 32][2] = 64 - (i << 1);
        colors[i + 64][0] = 255;
        colors[i + 64][1] = i << 3;
        colors[i + 96][0] = 255;
        colors[i + 96][1] = 255;
        colors[i + 96][2] = i << 2;
        colors[i + 128][0] = 255;
        colors[i + 128][1] = 255;
        colors[i + 128][2] = 64 + (i << 2);
        colors[i + 160][0] = 255;
        colors[i + 160][1] = 255;
        colors[i + 160][2] = 128 + (i << 2);
        colors[i + 192][0] = 255;
        colors[i + 192][1] = 255;
        colors[i + 192][2] = 192 + i;
        colors[i + 224][0] = 255;
        colors[i + 224][1] = 255;
        colors[i + 224][2] = 224 + i;
    }
    
    var fire = [];
    
    for (var i = 0; i < canvasWidth * canvasHeight; i++) {
        fire[i] = 0;
    }
    
    var time = new Date().getTime();
    
    function randomizeThreshold() {
        threshold += Math.random() * 0.2 - 0.1;
        threshold = Math.min(Math.max(threshold, 0.5), 0.8);
    }
    
    function burnBurnBurn() {
        window.requestAnimationFrame(burnBurnBurn);
        var now = new Date().getTime();
        dt = now - time;
        
        if (dt < (1000 / fps))
            return;
            
        time = now;
        
        var bottomLine = canvasWidth * (canvasHeight - 1);
        
        for (var x = 0; x < canvasWidth; x++) {
            var value = 0;
            
            if (Math.random() > threshold)
                value = 255;
                
            fire[bottomLine + x] = value;
        }
        
        var value = 0;
        
        for (var y = 0; y < canvasHeight; ++y) {
            for (var x = 0; x < canvasWidth; ++x) {
                if (x == 0) {
                    value = fire[bottomLine];
                    value += fire[bottomLine];
                    value += fire[bottomLine - canvasWidth];
                    value /= 3;
                } else if (x == canvasWidth -1) {
                    value = fire[bottomLine + x];
                    value += fire[bottomLine - canvasWidth + x];
                    value += fire[bottomLine + x - 1];
                    value /= 3;
                } else {
                    value = fire[bottomLine + x];
                    value += fire[bottomLine + x + 1];
                    value += fire[bottomLine + x - 1];
                    value += fire[bottomLine - canvasWidth + x];
                    value /= 4;
                }
                
                if (value > 1)
                    value -= 1;
                
                value = Math.floor(value);
                var index = bottomLine - canvasWidth + x;
                fire[index] = value;
            }
            
            bottomLine -= canvasWidth;
        }
        
        var skipRows = 2;
        
        for (var y = skipRows; y < canvasHeight; ++y) {
            for (var x = 0; x < canvasWidth; ++x) {
                var index = y * canvasWidth * 4 + x * 4;
                var value = fire[(y - skipRows) * canvasWidth + x];
                
                data[index] = colors[value][0];
                data[++index] = colors[value][1];
                data[++index] = colors[value][2];
                data[++index] = 255;
            }
        }
        
        if (intensity == null) {
            if (Math.random() > 0.95) {
                randomizeThreshold();
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
};

window.requestAnimationFrame(burnBurnBurn);

document.body.onkeyup = function(event) {
    if (event.keyCode >= 97 && event.keyCode <= 105) {
        intensity = (event.keyCode - 97);
        intensity = intensity / 8;
        intensity = intensity * 0.4;
        intensity = intensity + 0.2;
        threshold = 1 - intensity;
    } else if (event.keyCode == 96) {
        intensity = 0;
        randomizeThreshold();
    }
 };

});