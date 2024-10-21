import tool from "./tool";

function circle(canvas, lineWidth, strokeStyle, fillStyle, socket, id){
    let mouseDown
    let startX, startY, saved, width, height, r
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
                type: "circle",
                x: startX,
                y: startY,
                r,
                strokeStyle,
                fillStyle,
                lineWidth
            }
        }))
    }
    const mouseDownHandler = (e) => {
        mouseDown = true
        ctx.beginPath()
        startX = e.pageX - e.target.offsetLeft
        startY = e.pageY - e.target.offsetTop
        saved = canvas.toDataURL()
    }
    const mouseMoveHandler = (e) => {
        if(mouseDown){
            let currentX = e.pageX - e.target.offsetLeft;
            let currentY = e.pageY - e.target.offsetTop;
            width = currentX - startX
            height = currentY - startY
            r = Math.sqrt(width**2 + height**2)
            draw(startX, startY, r)
        }
    }
    const draw = (x,y,r) => {
        const img = new Image()
        img.src = saved
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)
            ctx.beginPath()
            ctx.arc(x, y, r, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()
        }
    }
    listen()
}

export const circleDraw = (ctx, x, y, r, strokeStyle, fillStyle, lineWidth) => {
    ctx.strokeStyle = strokeStyle
    ctx.fillStyle = fillStyle
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
}
export default circle