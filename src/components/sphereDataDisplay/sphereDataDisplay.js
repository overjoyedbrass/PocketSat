import { Box, Button } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

const [width, height] = [500, 500];
const MIN_RADIUS = width/2-30;
const MAX_ALTITUDE = 90;
const MAX_RADIUS = 50*MIN_RADIUS;
const ZOOM_DELTA = 100;
const MAX_DRAW = 100;
const ZOOM_DELTA_RATIO = ZOOM_DELTA/MIN_RADIUS;
const DARK_GREY = "#555555";
const CLOCK_DELTA = Math.PI/12;

function preventDefault(e){e.preventDefault()};

function drawCircle(ctx, x, y, r, color, fill="") {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    if(fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    ctx.stroke();
}

function drawDot(ctx, x, y, r, color) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

function dataToSatPoints(data, radius, x0, y0) {
    const ratio = radius/MAX_ALTITUDE;
    return data.map(sat => horizontalToXY(sat, x0, y0, ratio));
}

function horizontalToXY(sat, x0, y0, ratio) {
    let [alt, az] = [Math.abs(sat.h), sat.az];
    alt = MAX_ALTITUDE - alt;
    const x = (alt*ratio) * Math.cos(az) + x0;
    const y = (alt*ratio) * Math.sin(az) + y0;
    return {x, y, alt: sat.h};

}
function drawDots(ctx, dots, dotW, dotColor) {
    for(let i = 0; i < Math.min(dots.length, MAX_DRAW); i++ ) {
        let dot = dots[i];
        drawDot(ctx, dot.x, dot.y, dotW, dot.alt < 0 ? "gray" : dotColor);
    }
    let last = dots.slice(-1)[0];
    drawDot(ctx, last.x, last.y, dotW+1, "red");
}
function connectDots(ctx, dots, lineColor) {
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    for(let i = 0; i < Math.min(dots.length-1, MAX_DRAW); i++) {
        let p1 = dots[i];
        let p2 = dots[i+1];
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
    }
    ctx.closePath();
    ctx.stroke();
}

function radiansToDegrees(rad) {
    return Math.ceil(180/Math.PI*rad);
}

function drawClock(ctx, radius, x0, y0) {
    ctx.beginPath();
    ctx.strokeStyle = DARK_GREY;
    ctx.fillStyle = "white";
    ctx.font = "12px Segoe UI";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const TEXT_DISTANCE_FROM_CIRCLE = 15;
    var text_angle = 0;
    var text_angle_delta = radiansToDegrees(CLOCK_DELTA);
    for(let angle = 0; angle <= 2*Math.PI; angle += CLOCK_DELTA) {
        const x = Math.cos(angle);
        const y = Math.sin(angle);
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0 + x*radius, y0 + y*radius);
        if(angle < 2*Math.PI-CLOCK_DELTA) {
            ctx.fillText(`${text_angle}°`, x0+x*(radius+TEXT_DISTANCE_FROM_CIRCLE), y0+y*(radius+TEXT_DISTANCE_FROM_CIRCLE));
        }
        text_angle += text_angle_delta;
    }
    ctx.stroke();
    for(let angle = 0; angle <= 90; angle += 10) {
        drawCircle(ctx, x0, y0, angle/90*radius, DARK_GREY);
    }
}

const dotW = 1;

export const SphereDataDisplay = ({ data }) => {
    const [radius, setRadius] = useState(MIN_RADIUS);
    const [offset, setOffset] = useState({x:0, y:0});
    const [context, setContext] = useState(null);

    const [moving, setMoving] = useState(false);
    const [mouseXY, setMouseXY] = useState({});

    const canvasRef = useRef(null);
    
    function drawData() {
        const [x0, y0] = [width/2 + offset.x, height/2 + offset.y];
        context.fillStyle = '#000000';        
        context.clearRect(0, 0, width, height);
        drawCircle(context, x0, y0, radius, "black", "black");
        drawCircle(context, x0, y0, radius, "white");
        drawClock(context, radius, x0, y0);

        const satellitePoints = dataToSatPoints(data, radius, x0, y0);

        connectDots(context, satellitePoints, "teal");
        drawDots(context, satellitePoints, dotW, "lime");
    }

    function onScroolWheel(e) {
        const deltaY = e.deltaY;
        const diff = deltaY < 0 ? 1 : -1;
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseXY = {x: e.clientX - rect.left, y: e.clientY - rect.top}
        const newRadius =  diff > 0 ? Math.min(MAX_RADIUS, radius + ZOOM_DELTA):
                                      Math.max(MIN_RADIUS, radius - ZOOM_DELTA);
        const radiusRatio = radius/MIN_RADIUS;

        const [x0, y0] = [width/2 + offset.x, height/2 + offset.y];
        const [dx, dy] = diff > 0 ? [
            (mouseXY.x - x0)*ZOOM_DELTA_RATIO/radiusRatio,
            (mouseXY.y - y0)*ZOOM_DELTA_RATIO/radiusRatio,
        ] : [
            (x0 - mouseXY.x)*ZOOM_DELTA_RATIO/radiusRatio,
            (y0 - mouseXY.y)*ZOOM_DELTA_RATIO/radiusRatio,
        ];
        const newOffset = {
            x: offset.x - dx,
            y: offset.y - dy,
        }
        if(newRadius !== radius) {
            setRadius(newRadius);
            setOffset(newOffset);
        }
    }

    function dragStart(e) {
        setMoving(true);
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMouseXY({x, y});
        canvasRef.current.style.cursor = "grabbing";

    }

    function drag(e) {
        if(moving) {
            const rect = canvasRef.current.getBoundingClientRect();
            const newXY = {x: e.clientX - rect.left, y: e.clientY - rect.top};
            const diff = {x: newXY.x - mouseXY.x, y: newXY.y - mouseXY.y};
            setOffset({x: offset.x + diff.x, y: offset.y + diff.y});
            setMouseXY({x: newXY.x, y: newXY.y});
        }
    }

    function dragEnd(e) {
        setMoving(false);
        canvasRef.current.style.cursor = "grab";
    }

    useEffect(() => {
        if(canvasRef) {
            setContext(canvasRef.current.getContext("2d"));
        }
    }, [canvasRef]);

    useEffect(() => {
        if(context) {
            drawData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context, radius, offset]);

    return (<Box position="relative">
        <canvas ref={canvasRef} id="sphereCanvas" height={height} width={width}
            onDragStart={preventDefault}
            onDrag={preventDefault}
            onDragEnd={preventDefault}
            onMouseDown={dragStart}
            onMouseMove={drag}
            onMouseLeave={dragEnd}
            onMouseUp={dragEnd}
            onWheel={onScroolWheel}
            // onTouchStart={dragStart}
            // onTouchMove={drag}
            // onTouchEnd={dragEnd}
                
            style={{borderRadius: "10px", cursor: "grab", border: `1px solid rgba(255,255,255, 0.2)`}}
            />
            <Button size="xs" colorScheme="black" position="absolute" top={1} right={1} onClick={() => {setRadius(MIN_RADIUS); setOffset({x: 0, y: 0});}}>Reset</Button>
        </Box>)
}