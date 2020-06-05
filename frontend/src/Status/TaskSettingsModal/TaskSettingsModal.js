import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

export default function TaskSettingsModal(props) {
	const { close } = props

	return (
		<React.Fragment>
			<DialogContent>
				<DialogContentText>
					Modify the task
				</DialogContentText>
				<Button onClick={() => close()} variant="contained" color="secondary">
					Delete Task
				</Button>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => close()} color="primary">
					Cancel
				</Button>
				<Button onClick={() => true}>
					Apply
				</Button>
			</DialogActions>
		</React.Fragment>
	)
}