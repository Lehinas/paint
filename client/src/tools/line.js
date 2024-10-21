import tool from "./tool";

function line(canvas, lineWidth, strokeStyle, fillStyle, socket, id){
    let mouseDown
    let startX, startY, saved
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
                type: "line",
                startX,
                startY,
                endX: e.pageX - e.target.offsetLeft,
                endY: e.pageY - e.target.offsetTop
            }
        }))
    }
    const mouseDownHandler = (e) => {
        mouseDown = true
        startX = e.pageX - e.target.offsetLeft
        startY = e.pageY - e.target.offsetTop
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        saved = canvas.toDataURL()
    }
    const mouseMoveHandler = (e) => {
        if(mouseDown){
            draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
        }
    }
    const draw = (x,y) => {
        const img = new Image()
        img.src = saved
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)
            ctx.beginPath()
            ctx.moveTo(startX, startY)
            ctx.lineTo(x,y)
            ctx.stroke()
        }
    }
    listen()
}

export const lineDraw = (ctx, startX, startY, endX, endY, strokeStyle, fillStyle, lineWidth) => {
    console.log(startX, endX)
    ctx.strokeStyle = strokeStyle
    ctx.fillStyle = fillStyle
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()

}
export default line