import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import './Canvas.css';

const Canvas = () => {
    const { socket, isDrawer } = useGame();
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [drawing, setDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        contextRef.current = ctx;

        const handleDraw = ({ from, to, color, lineWidth }) => {
            contextRef.current.strokeStyle = color;
            contextRef.current.lineWidth = lineWidth;
            contextRef.current.beginPath();
            contextRef.current.moveTo(from.x, from.y);
            contextRef.current.lineTo(to.x, to.y);
            contextRef.current.stroke();
        };

        socket.on('draw', handleDraw);

        const handleClearCanvas = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
        socket.on('clearCanvas', handleClearCanvas);

        return () => {
            socket.off('draw', handleDraw);
            socket.off('clearCanvas', handleClearCanvas);
        };
    }, [socket]);

    const startDrawing = ({ nativeEvent }) => {
        if (!isDrawer) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setDrawing(true);
    };

    const finishDrawing = () => {
        if (!isDrawer) return;
        contextRef.current.closePath();
        setDrawing(false);
    };

    const draw = ({ nativeEvent }) => {
        if (!drawing || !isDrawer) return;
        const { offsetX, offsetY } = nativeEvent;
        const from = { x: contextRef.current.lastX, y: contextRef.current.lastY };
        const to = { x: offsetX, y: offsetY };
        
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        
        socket.emit('draw', {
            from,
            to,
            color: contextRef.current.strokeStyle,
            lineWidth: contextRef.current.lineWidth
        });

        contextRef.current.lastX = offsetX;
        contextRef.current.lastY = offsetY;
    };
    
    // Store last coordinates on the context itself
    useEffect(() => {
        if(contextRef.current) {
            contextRef.current.lastX = 0;
            contextRef.current.lastY = 0;
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className={`drawing-canvas ${isDrawer ? 'active' : 'disabled'}`}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            onMouseLeave={finishDrawing}
        />
    );
};

export default Canvas; 