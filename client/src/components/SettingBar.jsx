import React, {useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setLineWidth, setStrokeStyle} from "../store/ToolSlice";

const SettingBar = () => {
    const dispatch = useDispatch()
    const canvas = useRef(useSelector(state => state.canvas.canvasRef))

    const changeHandler = e => {
        dispatch(setLineWidth(e.target.value))
    }
    const changeColor = e => {
        dispatch(setStrokeStyle(e.target.value))
    }
    return (
        <div className="settingbar">
            <p>Толщина линии</p>
            <input type="number" defaultValue={1} min={1} max={50} onChange={e => changeHandler(e)}/>
            <p>Цвет обводки</p>
            <input type="color" onChange={e => changeColor(e)}/>
        </div>
    );
};

export default SettingBar;