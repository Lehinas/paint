
function tool(canvas, lineWidth, strokeStyle, fillStyle){
    const ctx = canvas.getContext("2d")
    const destroyEvents = () => {
        canvas.onmouseup = null
        canvas.onmousedown = null
        canvas.onmousemove = null
    }
    const setLineWidth = () => {
        ctx.lineWidth = lineWidth
    }
    const setStrokeStyle = () => {
        ctx.strokeStyle = strokeStyle
    }
    const setFillStyle = () => {
        ctx.fillStyle = fillStyle
    }

    destroyEvents()
    setLineWidth()
    setStrokeStyle()
    setFillStyle()
    return ctx;
}


export default tool