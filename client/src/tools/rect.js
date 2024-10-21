import tool from "./tool";

function rect(canvas, lineWidth, strokeStyle, fillStyle, socket, id){
    let mouseDown
    let startX, startY, saved, width, height
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
                type: "rect",
                x: startX,
                y: startY,
                width,
                height,
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
            draw(startX, startY, width, height)
        }
    }
    const draw = (x,y,w, h) => {
        const img = new Image()
        img.src = saved
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)
            ctx.beginPath()
            ctx.rect(x, y, w, h)
            ctx.fill()
            ctx.stroke()
        }
    }
    listen()
}
export const rectDraw = (ctx, x, y, w, h, strokeStyle, fillStyle, lineWidth) => {
    ctx.strokeStyle = strokeStyle
    ctx.fillStyle = fillStyle
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.fill()
    ctx.stroke()
}


export default rect