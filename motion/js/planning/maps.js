/**
 * Created by Hege on 2014.11.07..
 */
define('planning.maps', [ 'utils.imgConvert' ], function(imgConvert) {

    function BoolArr(length) {
        return new Uint8Array(length);
    }
    function setBoolArr(arr, index, val) {
        arr[index] = val ? 1 : 0;
    }


    function Map(fn, width, height) {
        this.fn = fn;
        this.width = width;
        this.height = height;
    }

    function mapFromArr(arr, w, h) {
        return function(x, y) {
            return arr[(y|0) * w + (x|0)];
        };
    }

    function instrument(fn) {
        var count = 0;
        var resultFn = function() {
            count++;
            return fn.apply(this, arguments);
        };
        resultFn.count = function() { return count; };
        return resultFn;
    }

    function colmin(arr, idx) {
        idx *= 4;
        var r = arr[idx];
        var g = arr[idx + 1];
        var b = arr[idx + 2];
        var x = r < g ? r : g;
        return x < b ? x : b;
    }

    function fromCanvas(canvas, ctx) {
        var imageData = imgConvert.canvasToData(canvas, ctx);
        var data = imageData.data;
        var width = imageData.width | 0, height = imageData.height | 0;
        var pixelCount = width * height;
        var boolarr = BoolArr(pixelCount);
        for (var i = 0; i < pixelCount; i++) {
            setBoolArr(boolarr, i, colmin(data, i) < 128);
        }
        var fn = mapFromArr(boolarr, width, height);
        return new Map(fn, imageData.width, imageData.height);
    }

    return {
        Map: Map,
        fromCanvas: fromCanvas,
        instrument: instrument
    }
});