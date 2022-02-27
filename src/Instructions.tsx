import React, { useEffect, useRef } from 'react';

export default function Instructions(props: { controls: any; }){
    const { controls } = props;
    const blockerRef = useRef<HTMLDivElement>(null);
    const instructionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (instructionsRef.current) {
            instructionsRef.current.addEventListener('click', () => { controls.lock(); });
        }
    }, [controls]);
    useEffect(() => {
        controls.addEventListener('lock', () => {
            if (instructionsRef.current && blockerRef.current){
                instructionsRef.current.style.display = 'none';
                blockerRef.current.style.display = 'none';
            }
        });
    }, [controls]);
    useEffect(() => {
        controls.addEventListener('unlock', () => {
            if (instructionsRef.current && blockerRef.current){
                blockerRef.current.style.display = 'block';
                instructionsRef.current.style.display = 'flex';
            }
        });
    }, [controls]);

    return (
        <div
            style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            }}
            ref={blockerRef}
        >
            <div
            style={{
                width: '100%',
                height: '100%',
    
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
    
                textAlign: 'center',
                fontSize: '36px',
                cursor: 'pointer',
            }}
            ref={instructionsRef}
            >
            <p>
                Click to play
            </p>
            <p>
                Move: WASD
                <br />
                Look: MOUSE
            </p>
            </div>
        </div>
        );
}