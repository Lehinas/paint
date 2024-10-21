import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setFillStyle, setStrokeStyle, setTool} from "../store/ToolSlice";
import brush from "../tools/brush";
import rect from "../tools/rect";
import circle from "../tools/circle";
import line from "../tools/line";
import clear from "../tools/clear";
import {pushToUndo, redo, undo} from "../store/CanvasSlice";

const ToolBar = () => {

    const dispatch = useDispatch()
    const canvas = useSelector((state) => state.canvas.canvasRef)
    const {socket, sessionId} = useSelector(state => state.canvas)
    const {tool, lineWidth, strokeStyle, fillStyle} = useSelector(state => state.tool)
    const canvasRef = useRef(null)
    const [selectedTool, setSelectedTool] = useState("brush")
    const changeColor = e => {
        dispatch(setStrokeStyle(e.target.value))
        dispatch(setFillStyle(e.target.value))
    }
    useEffect(() => {
        if (canvas) {
            canvasRef.current = canvas
            switch (tool) {
                case "brush":
                    brush(canvasRef.current, lineWidth, strokeStyle, fillStyle, socket, sessionId)
                    break
                case "rect":
                    rect(canvasRef.current, lineWidth, strokeStyle, fillStyle, socket, sessionId)
                    break
                case "circle":
                    circle(canvasRef.current,lineWidth, strokeStyle, fillStyle, socket, sessionId)
                    break
                case "eraser":
                    brush(canvasRef.current, lineWidth, "white", fillStyle, socket, sessionId)
                    break
                case "line":
                    line(canvasRef.current, lineWidth, strokeStyle, fillStyle, socket, sessionId)
                    break
                case "clear":
                    clear(canvasRef.current, socket, sessionId)
                    break
            }
        }
    }, [canvas, tool, lineWidth, strokeStyle, fillStyle, socket, sessionId])

    const changeTool = tool => {
        dispatch(setTool(tool))
        setSelectedTool(tool)
    }
    const undoList = useSelector(state => state.canvas.undoList)
    const undoHandler = () => {
        if(canvas){
            socket.send(JSON.stringify({
                method: "draw",
                id: sessionId,
                figure: {
                    type: "undo",
                    undoList
                }
            }))
        }
    }
    const redoList = useSelector(state => state.canvas.redoList)
    const redoHandler = () => {
        if(canvas){
            socket.send(JSON.stringify({
                method: "draw",
                id: sessionId,
                figure: {
                    type: "redo",
                    redoList
                }
            }))
        }
    }

    const download = () => {
        const dataUrl = canvas.toDataURL()
        const a = document.createElement("a")
        a.href = dataUrl
        a.download = sessionId + ".jpg"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return (
        <div className="toolbar">
            <button className={`toolbar_tool brush ${selectedTool === "brush" ? "selected" : ""}`}
                    onClick={() => changeTool("brush")}></button>
            <button className={`toolbar_tool rect ${selectedTool === "rect" ? "selected" : ""}`}
                    onClick={() => changeTool("rect")}></button>
            <button className={`toolbar_tool circle ${selectedTool === "circle" ? "selected" : ""}`}
                    onClick={() => changeTool("circle")}></button>
            <button className={`toolbar_tool eraser ${selectedTool === "eraser" ? "selected" : ""}`}
                    onClick={() => changeTool("eraser")}></button>
            <button className={`toolbar_tool line ${selectedTool === "line" ? "selected" : ""}`}
                    onClick={() => changeTool("line")}></button>
            <input type="color" className="toolbar_tool color" onChange={e => changeColor(e)}/>
            <button className="toolbar_tool clear" onClick={() => changeTool("clear")}></button>
            <button className="toolbar_tool undo" onClick={() => undoHandler()}></button>
            <button className="toolbar_tool redo" onClick={() => redoHandler()}></button>
            <button className="toolbar_tool save" onClick={() => download()}></button>
        </div>
    );
};

export default ToolBar;