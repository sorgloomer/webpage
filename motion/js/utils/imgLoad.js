define('utils.imgLoad', [ 'utils.imgConvert' ], function(imgConvert) {

    function asImage(source, callback) {
        var img = new Image();
        img.src = source;
        img.onload = function() {
            callback.call(img, img);
        };
        return img;
    }

    function asCanvas(source, callback) {
        var canvas = document.createElement('canvas');
        asImage(source, function(img) {
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = imgConvert.canvasToContext(canvas);
            ctx.drawImage(img, 0, 0);
            callback(canvas, ctx);
        });
        return canvas;
    }

    return {
        asImage: asImage,
        asCanvas: asCanvas
    };
});
