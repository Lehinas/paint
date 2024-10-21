import {createSlice} from "@reduxjs/toolkit";
import {useSelector} from "react-redux";


const ToolSlice = createSlice({
    name: "toolSlice",
    initialState: {
        tool: "brush",
        fillStyle: "black",
        strokeStyle: "black",
        lineWidth: "1",
    },
    reducers:{
        setTool: (state, action) => {
            state.tool = action.payload
        },
        setFillStyle: (state, action) => {
            state.fillStyle = action.payload
        },
        setStrokeStyle: (state, action) => {
            state.strokeStyle = action.payload
        },
        setLineWidth: (state, action) => {
            state.lineWidth = action.payload
        },
    }
})

export const {setTool, setFillStyle, setLineWidth, setStrokeStyle, setMouse} = ToolSlice.actions

export default ToolSlice.reducer