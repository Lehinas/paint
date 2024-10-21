import {combineReducers, configureStore} from "@reduxjs/toolkit";
import toolSlice from "./ToolSlice";
import CanvasSlice from "./CanvasSlice";


const rootReducer = combineReducers({
    tool: toolSlice,
    canvas: CanvasSlice
})

export default configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})