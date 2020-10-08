

export class InputRegistry {
    constructor(mousecontext=window, keycontext=mousecontext) {
        this._pressed = new Map();
        this.mouse = {x:0,y:0};

        this._binds = [];

        this._attach(keycontext, "keydown", this._handleKeyDown.bind(this));
        this._attach(keycontext, "keyup", this._handleKeyUp.bind(this));
        this._attach(mousecontext, "mousemove", this._handleMouseMove.bind(this));
        this._attach(mousecontext, "mousedown", this._handleMouseDown.bind(this));
        this._attach(mousecontext, "mouseup", this._handleMouseUp.bind(this));
        this._attach(mousecontext, "contextmenu", this._handleContextMenu.bind(this));
    }

    pressed(name) {
        return !!this._pressed.get(name);
    }

    close() {
        this._binds.forEach(fn => fn());
    }

    _attach(ctx, event, fn) {
        ctx.addEventListener(event, fn);
        this._binds.push(() => { ctx.removeEventListener(event, fn); });
    }

    _handleKeyDown(e) {
        this._pressed.set(e.key, true);
    }
    _handleKeyUp(e) {
        this._pressed.set(e.key, false);
    }
    _handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }
    _handleMouseDown(e) {
        this._handleMouseUpDown(e, true);
    }
    _handleMouseUp(e) {
        this._handleMouseUpDown(e, false);
    }
    _handleMouseUpDown(e, down) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this._pressed.set("MouseButton" + e.button, down);
    }
    _handleContextMenu(e) {
        // Prevent showing menu on right-click
        e.preventDefault();
        return false;
    }
}


