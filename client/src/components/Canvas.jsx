import React, {useEffect, useRef, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../styles/canvas.scss';
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import {useParams} from "react-router-dom";
import Rect from "../tools/Rect";
import axios from 'axios';
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";
import Circle from "../tools/Circle";
const Canvas = observer(() => {
    const canvasRef = useRef();
    const usernameRef = useRef();
    const [modal, setModal] = useState(true);
    const {id} = useParams();

    useEffect(()=>{
        canvasState.setCanvas(canvasRef.current);
        toolState.setTool(new Brush(canvasRef.current));
        const ctx = canvasRef.current.getContext('2d')
        axios.get(`http://localhost:5000/image?id=${id}`).then(response => {
            const img = new Image();
            img.src = response.data;
            console.log(img);
            img.onload = () => {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
            }
        })
    }, [])

    useEffect(()=>{
        if(canvasState.username){
            const socket = new WebSocket('ws://localhost:5000/');
            canvasState.setSocket(socket);
            canvasState.setSessionId(id);
            toolState.setTool(new Brush(canvasRef.current, socket, id));
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id,
                    method: 'connection',
                    username: canvasState.username
                }))
            }
            socket.onmessage = (event) => {
                let msg = JSON.parse(event.data);
                switch (msg.method){
                    case 'connection':
                        console.log(`User ${msg.username} connected`);
                        break;
                    case 'draw':
                        drawHandler(msg);
                        break;
                }
            }
        }
    }, [canvasState.username])

    const drawHandler = (msg) => {
        const figure = msg.figure;
        const ctx = canvasRef.current.getContext('2d');
        switch(figure.type){
            case 'brush':
                Brush.draw(ctx, figure.x, figure.y);
                break;
            case 'eraser':
                Eraser.draw(ctx, figure.x, figure.y);
                break;
            case 'rect':
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color);
                break;
            case 'line':
                Line.staticDraw(ctx, figure.startX, figure.startY, figure.x, figure.y, figure.color);
                break;
            case 'circle':
                Circle.staticDraw(ctx, figure.x, figure.y, figure.r, figure.color);
                break;
            case 'finish':
                ctx.beginPath();
                break;
        }
    }

    const saveToUndoHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL());
        axios.post(`http://localhost:5000/image?id=${id}`, {
            img: canvasRef.current.toDataURL()
        }).then(response => console.log(response.data));
    }

    const connectionHandler = () => {
        canvasState.setUsername(usernameRef.current.value);
        setModal(false);
    }

    return (
        <div className='canvas'>
            <Modal show={modal} onHide={()=>{}}>
                <Modal.Header>
                    <Modal.Title>Введите имя</Modal.Title>
                </Modal.Header>
                <Modal.Body><input ref={usernameRef} type="text"/></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={connectionHandler}>
                        Войти
                    </Button>
                </Modal.Footer>
            </Modal>
            <canvas onMouseDown={saveToUndoHandler} ref={canvasRef} width={1000} height={700}/>
        </div>
    );
});

export default Canvas;