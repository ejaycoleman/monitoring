import React from 'react';
import { useRef, useEffect } from "react";

import Paper from '@material-ui/core/Paper'

export default function Notification(props) {
    const { show, onClose } = props
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
		<div ref={wrapperRef} style={{
            display: show? 'block' : 'none', 
            position: 'fixed', 
            top: 15, 
            right: 15, 
            textAlign: 'center',
            height: 50,            
        }}>
            <Paper elevation={3} style={{padding: 10, width: 250, height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{props.children}</Paper>
		</div>
	)
}