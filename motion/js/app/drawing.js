/**
 * Created by Hege on 2014.11.07..
 */
define('app.drawing', [
    'utils.Mouse'
], function(
    Mouse
) {
    function attach(mazeContext, elementId) {
        var mouse = new Mouse(document.getElementById(elementId || 'maincanvas'));

        mouse.ondown = function(button, x, y) {
            var lineWidth = button ? 60 : 10;
            if (mazeContext) {
                var style = button ? 'white' : 'darkgreen';
                mazeContext.fillStyle = style;
                mazeContext.strokeStyle = style;
                mazeContext.lineWidth = lineWidth;
                mazeContext.lineCap = 'round';

                mazeContext.beginPath();
                mazeContext.arc(x, y, lineWidth * 0.5, 0, 360);
                mazeContext.fill();
            }
        };

        mouse.ondrag = function(buttons, x, y, px, py) {
            if (mazeContext) {
                mazeContext.beginPath();
                mazeContext.moveTo(x, y);
                mazeContext.lineTo(px, py);
                mazeContext.stroke();
            }
        };
        return mouse;
    }

    return {
        attach: attach
    };
});