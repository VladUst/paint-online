import {makeAutoObservable} from "mobx";

class CanvasState{
    canvas = null;
    undoList = [];
    redoList = [];
    username = [];
    socket = null;
    sessionId = null;
    constructor() {
        makeAutoObservable(this);
    }

    setUsername(username){
        this.username = username;
    }

    setSocket(socket){
        this.socket = socket;
    }

    setSessionId(sessionId){
        this.sessionId = sessionId;
    }

    pushToUndo(data){
        this.undoList.push(data);
    }

    pushToRedo(data){
        this.redoList.push(data);
    }

    undo(){
        const ctx = this.canvas.getContext('2d');
        if(this.undoList.length > 0){
            const prevState = this.undoList.pop();
            this.redoList.push(this.canvas.toDataURL());
            const img = new Image();
            img.src = prevState;
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            }
        } else {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    redo(){
        const ctx = this.canvas.getContext('2d');
        if(this.redoList.length > 0){
            const nextState = this.redoList.pop();
            this.undoList.push(this.canvas.toDataURL());
            const img = new Image();
            img.src = nextState;
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            }
        }
    }

    setCanvas(canvas){
        this.canvas = canvas;
    }
}

export default new CanvasState();