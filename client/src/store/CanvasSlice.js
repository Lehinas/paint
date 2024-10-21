import {createSlice} from "@reduxjs/toolkit";


const CanvasSlice = createSlice({
    name: "canvasSlice",
    initialState: {
        canvasRef: null,
        undoList: [],
        redoList: [],
        username: null,
        socket: null,
        sessionId: null
    },
    reducers: {
        setCanvas: (state, action) => {
            state.canvasRef = action.payload
        },
        pushToUndo: (state, action) => {
            state.undoList.push(action.payload)
        },
        pushToRedo: (state,action) => {
            state.redoList.push(action.payload)
        },
        changeUndoList: (state, action) => {
            state.undoList = action.payload
        },
        changeRedoList: (state, action) => {
            state.redoList = action.payload
        },
        undo: (state,action) => {
            const width = state.canvasRef.width
            const height = state.canvasRef.height
            const ctx = state.canvasRef.getContext("2d")
            if(state.undoList.length > 0){
                let dataUrl = state.undoList.pop()
                state.redoList.push(state.canvasRef.toDataURL())
                let img = new Image()
                img.src = dataUrl
                img.onload = () => {
                    ctx.clearRect(0,0, width, height)
                    ctx.drawImage(img, 0, 0, width, height)
                }
            }else{
                ctx.clearRect(0,0, width, height)
            }
        },
        redo: (state, action) => {
            const width = state.canvasRef.width
            const height = state.canvasRef.height
            const ctx = state.canvasRef.getContext("2d")
            if(state.redoList.length > 0){
                let dataUrl = state.redoList.pop()
                state.undoList.push(state.canvasRef.toDataURL())
                let img = new Image()
                img.src = dataUrl
                img.onload = () => {
                    ctx.clearRect(0,0, width, height)
                    ctx.drawImage(img, 0, 0, width, height)
                }
            }
        },
        setUsername: (state, action) => {
            state.username = action.payload
        },
        setSocket: (state, action) => {
            state.socket = action.payload
        },
        setSessionId: (state, action) => {
            state.sessionId = action.payload
        }
    }
})

export const {setCanvas, changeUndoList, changeRedoList, pushToUndo, pushToRedo, undo, redo, setUsername, setSocket, setSessionId} = CanvasSlice.actions
export default CanvasSlice.reducer