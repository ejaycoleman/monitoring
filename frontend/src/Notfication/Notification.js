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
		<div ref={wrapperRef} style={{display: show? 'block' : 'none', position: 'fixed', top:0, right:0, textAlign: 'center'}}>
			<Paper style={{width: 200}}>{props.children}</Paper>
		</div>
	)
}