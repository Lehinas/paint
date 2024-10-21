import React, {useEffect, useRef, useState} from 'react';
import {
    changeRedoList,
    changeUndoList, pushToRedo,
    pushToUndo, redo,
    setCanvas,
    setSessionId,
    setSocket,
    setUsername,
    undo
} from "../store/CanvasSlice";
import {useDispatch, useSelector} from "react-redux";
import {Button, Modal} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {brushDraw} from "../tools/brush";
import {rectDraw} from "../tools/rect";
import axios from "axios";
import {circleDraw} from "../tools/circle";
import {lineDraw} from "../tools/line";
import clear, {clearCanvas} from "../tools/clear";

const Canvas = () => {
    const canvasRef = useRef()
    const dispatch = useDispatch()
    const username = useSelector(state => state.canvas.username)
    const {undoList, redoList} = useSelector(state => state.canvas)
    const [showModal, setShowModal] = useState(true)
    const usernameRef = useRef()
    const params = useParams()
    useEffect(() => {
        dispatch(setCanvas(canvasRef.current));
        axios.get(`http://localhost:5000/image?id=${params.id}`).then((response) => {
            const img = new Image()
            img.src = response.data
            const ctx = canvasRef.current.getContext("2d")
            img.onload = () => {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                ctx.drawImage(img, 0, 0)
                ctx.stroke()
            }
        })
    }, [canvasRef.current]);
    useEffect(() => {
        if(username){
            const socket = new WebSocket("ws://localhost:5000")
            dispatch(setSocket(socket))
            dispatch(setSessionId(params.id))
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id: params.id,
                    username,
                    method: "connection"
                }))
            }
            socket.onmessage = (event) => {
                const msg = JSON.parse(event.data)
                switch(msg.method){
                    case "connection":
                        console.log(`Пользователь ${msg.username} подключлен`)
                        break
                    case "draw":
                        drawHandler(msg)
                        break
                }
            }
        }
    }, [username]);

    const socket = useSelector(state => state.canvas.socket)
    const id = useSelector(state => state.canvas.sessionId)
    const mouseDownHandler = () => {
        if(canvasRef.current){
            socket.send(JSON.stringify({
                method: "draw",
                id,
                figure: {
                    type: "pushUndo"
                }
            }))
        }
    }

    const mouseUpHandler = () => {
        if(canvasRef.current){
            axios.post(`http://localhost:5000/image?id=${params.id}`, {
                img: canvasRef.current.toDataURL()
            })
        }
    }

    const connectHandler = () => {
        dispatch(setUsername(usernameRef.current.value))
        setShowModal(false)
    }

    const drawHandler = (msg) => {
        const figure = msg.figure
        const ctx = canvasRef.current.getContext("2d")
        switch(figure.type){
            case "brush":
                brushDraw(ctx, figure.x, figure.y, figure.strokeStyle, figure.fillStyle, figure.lineWidth)
                break
            case "rect":
                rectDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.strokeStyle, figure.fillStyle, figure.lineWidth)
                break
            case "circle":
                circleDraw(ctx, figure.x, figure.y, figure.r, figure.strokeStyle, figure.fillStyle, figure.lineWidth)
                break
            case "line":
                lineDraw(ctx, figure.startX, figure.startY, figure.endX, figure.endY, figure.strokeStyle, figure.fillStyle, figure.lineWidth)
                break
            case "clear":
                clearCanvas(ctx, figure.width, figure.height)
                axios.post(`http://localhost:5000/image?id=${params.id}`, {
                    img: canvasRef.current.toDataURL()
                })
                break
            case "undo":
                dispatch(changeUndoList(figure.undoList))
                dispatch(undo())
                dispatch(pushToRedo(canvasRef.current.toDataURL()))
                break
            case "redo":
                dispatch(changeRedoList(figure.undoList))
                dispatch(redo())
                dispatch(pushToUndo(canvasRef.current.toDataURL()))

                break
            case "pushUndo":
                dispatch(pushToUndo(canvasRef.current.toDataURL()))
                break
            case "finish":
                ctx.beginPath()
                break
        }
    }

     return (
        <div className="canvas">
            <Modal show={showModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Введите ваше имя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type={"text"} ref={usernameRef}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => connectHandler()}>
                        Войти
                    </Button>
                </Modal.Footer>
            </Modal>
            <canvas onMouseDown={() => mouseDownHandler()} onMouseUp={() => mouseUpHandler()} width={1200} height={500} ref={canvasRef}></canvas>
        </div>
    );
};

export default Canvas;