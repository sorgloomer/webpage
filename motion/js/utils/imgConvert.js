define('utils.imgConvert', [], function() {
    // Converts image to canvas; returns new canvas element
    function imageToCanvas(image) {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        canvasToContext(canvas).drawImage(image, 0, 0);
        return canvas;
    }

    // Converts canvas to an image
    function canvasToImage(canvas) {
        var image = new Image();
        image.src = canvas.toDataURL("image/bmp");
        return image;
    }

    function imageToData(img) {
        var canvas = imageToCanvas(img);
        return canvasToData(canvas);
    }

    function canvasToData(canvas, ctx) {
        ctx = ctx || canvasToContext(canvas);
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    function canvasToContext(canvas) {
        return canvas.getContext('2d');
    }

    return {
        imageToCanvas: imageToCanvas,
        canvasToImage: canvasToImage,
        imageToData: imageToData,
        canvasToData: canvasToData,
        canvasToContext: canvasToContext
    };
});
