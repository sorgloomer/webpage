/**
 * Created by Hege on 2014.09.28..
 */

define('utils.Mouse', [ 'utils.time' ], function(time) {

    function returnFalse() { return false; }

    var timeDelta = 5;
    function Mouse(domElement) {
        var self = this;
        var lastTime = null;

        function onMouseMove(e) {
            if (time() > lastTime) {
                lastTime += timeDelta;
                var buttons = self.buttons;
                var px = self.px = self.x;
                var py = self.py = self.y;
                var x = self.x = e.offsetX;
                var y = self.y = e.offsetY;

                if (buttons && self.ondrag) {
                    self.ondrag(buttons, x, y, px, py);
                }
                if (self.onmove) {
                    self.onmove(buttons, x, y, px, py);
                }
            }
        }
        function onMouseDown(e) {
            var button = e.button;
            var buttons = (self.buttons |= (1 << button));
            var x = self.x = self.px = e.offsetX;
            var y = self.y = self.py = e.offsetY;
            lastTime = time() + timeDelta;
            if (self.ondown) {
                self.ondown(button, x, y, buttons);
            }
        }
        function onMouseUp(e) {
            var button = e.button;
            var buttons = (self.buttons &= ~(1 << button));
            var x = self.x = e.offsetX;
            var y = self.y = e.offsetY;
            if (self.onup) {
                self.onup(button, x, y, buttons);
            }
        }
        function onMouseOver() {
            self.isin = true;
        }
        function onMouseOut() {
            self.buttons = 0;
            self.isin = false;
        }

        domElement.onmousemove = onMouseMove;
        domElement.onmousedown = onMouseDown;
        domElement.onmouseup = onMouseUp;
        domElement.onmouseover = onMouseOver;
        domElement.onmouseout = onMouseOut;
        domElement.oncontextmenu = returnFalse;

        this.x = 0;
        this.y = 0;
        this.px = 0;
        this.py = 0;
        this.isin = false;
        this.buttons = 0;
        this.onmove = null;
        this.ondrag = null;
        this.ondown = null;
        this.onup = null;
    }
    return Mouse;
});