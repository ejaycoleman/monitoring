import React from 'react';
import { useRef, useEffect } from "react";

import Paper from '@material-ui/core/Paper'

export default function InteractiveModal(props) {
    const { show, onClose, children } = props
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (!wrapperRef.current.contains(e.target)) {
                onClose()
            } 
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    })

	return (
        <div style={{
            zIndex: 99999999,
            height: '100%',
            width: '100%',
            position: 'fixed',
            backgroundColor: '#000000AA',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: show? 'flex' : 'none', 
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div ref={wrapperRef} style={{
                zIndex: 500000, 
                position: 'fixed', 
                marginLeft: "auto", 
                marginRight: 'auto', 
                width: 500,
            }}>
                <Paper style={{
                    bottom: 0,
                    top: 0,
                }}>{show && children}</Paper>
            </div>
        </div>
	)   
}