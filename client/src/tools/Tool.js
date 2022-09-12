export default class Tool{
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.destroyPrevSettings();
    }

    set fillColor(color){
        this.ctx.fillStyle = color;
    }

    set strokeColor(color){
        this.ctx.strokeStyle = color;
    }

    set lineWidth(width){
        this.ctx.lineWidth = width;
    }

    destroyPrevSettings(){
        this.canvas.onmousemove = null;
        this.canvas.onmousedown = null;
        this.canvas.onmouseup = null;
    }
}