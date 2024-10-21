import tool from "./tool";
import line from "./line";

function brush(canvas, lineWidth, strokeStyle, fillStyle, socket, id){
    let mouseDown;
    const ctx = tool(canvas, lineWidth, strokeStyle, fillStyle)


    const listen = () => {
        canvas.onmouseup = mouseUpHandler
        canvas.onmousedown = mouseDownHandler
        canvas.onmousemove = mouseMoveHandler
    }

    const mouseUpHandler = (e) => {
        mouseDown = false
        socket.send(JSON.stringify({
            method: "draw",
            id,
            figure: {
                type: "finish"
            }
        }))
    }
    const mouseDownHandler = (e) => {
        mouseDown = true
        ctx.beginPath()
        ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
    }
    const mouseMoveHandler = (e) => {
        if(mouseDown){
            socket.send(JSON.stringify({
                method: "draw",
                id,
                figure: {
                    type: "brush",
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    strokeStyle,
                    fillStyle,
                    lineWidth
                }
            }))
        }
    }
    listen()
}

export const brushDraw = (ctx, x, y, strokeStyle, fillStyle, lineWidth) => {
    ctx.strokeStyle = strokeStyle
    ctx.fillStyle = fillStyle
    ctx.lineWidth = lineWidth
    ctx.lineTo(x,y)
    ctx.stroke()
}

export default brush