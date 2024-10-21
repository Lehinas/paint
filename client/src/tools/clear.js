function clear(canvas, socket, id){
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    socket.send(JSON.stringify({
        method: "draw",
        id,
        figure: {
            type: "clear",
            width: canvas.width,
            height: canvas.height
        }
    }))
}

export const clearCanvas = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height)
}

export default clear