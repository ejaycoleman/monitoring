// The component for users changing their preferences for when to be alerted for late execution updates

import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormGroup from '@material-ui/core/FormGroup'
import Notification from '../../Notification/Notification'
import WarningIcon from '@material-ui/icons/Warning'
import { setPreferences as setPreferecesAction } from '../../actions'
import { useDispatch } from 'react-redux'

export default function PreferencesModal(props) {
	const {close, preferences, setPreferences } = props
	const preference = preferences? preferences : null
	// absolute is referring to errors and ideal is referring to warnings
	const [idealFreq, setIdealFreq] = React.useState(preference.executionThresholdIdeal ? preference.executionThresholdIdeal.split("-")[0] : '1')
	const [idealPeriod, setIdealPeriod] = React.useState(preference.executionThresholdIdeal ? preference.executionThresholdIdeal.split("-")[1] : 'days')
	const [absoluteFreq, setAbsoluteFreq] = React.useState(preference.executionThresholdAbsolute ? preference.executionThresholdAbsolute.split("-")[0] : '10')
	const [absolutePeriod, setAbsolutePeriod] = React.useState(preference.executionThresholdAbsolute ? preference.executionThresholdAbsolute.split("-")[1] : 'days')	
	const [snackBarErrorShow, setSnackBarErrorShow] = React.useState(false)

	const dispatch = useDispatch();

	return (
		<React.Fragment>
			<DialogContent>
				<DialogContentText>
					Display warning/eror when executions have not been observed for...
				</DialogContentText>
				<FormGroup row>
					<TextField
						label="Warn after..."
						type="number"
						placeholder="frequency"
						value={idealFreq} onChange={e => setIdealFreq(e.target.value)}
					/>
					<NativeSelect value={idealPeriod} onChange={e => setIdealPeriod(e.target.value)}>
						<option value="days">days</option>
						<option value="weeks">weeks</option>
						<option value="months">months</option>
					</NativeSelect>
				</FormGroup>
				<FormGroup row>
					<TextField
						label="Error after..."
						type="number"
						placeholder="frequency"
						value={absoluteFreq} onChange={e => setAbsoluteFreq(e.target.value)}
					/>
					<NativeSelect value={absolutePeriod} onChange={e => setAbsolutePeriod(e.target.value)}>
						<option value="days">days</option>
						<option value="weeks">weeks</option>
						<option value="months">months</option>
					</NativeSelect>
				</FormGroup>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => close()} color="primary">
					Cancel
				</Button>
				<Button onClick={() => {
					// determine (in days) if errors are before warnings
					const multiplier = {days: 1, weeks: 7, months: 30}
					if (parseInt(absoluteFreq) * multiplier[absolutePeriod] < parseInt(idealFreq) * multiplier[idealPeriod]) {
						setSnackBarErrorShow(true)
						return
					}
					if (parseInt(absoluteFreq) <= 0 || parseInt(idealFreq) <= 0) {
						setSnackBarErrorShow(true)
						return
					}
					setPreferences(idealFreq, idealPeriod, absoluteFreq, absolutePeriod).then(({data}) => {
						dispatch(setPreferecesAction(data.setPreferences))
						close()
					}).catch(err => console.log(err))
					}} color="primary">
					Apply
				</Button>
			</DialogActions>
			<Notification show={snackBarErrorShow} onClose={() => setSnackBarErrorShow(false)}><WarningIcon style={{color: '#F2A83B', paddingRight: 5}}/>Warnings should be triggered before errors</Notification> 
		</React.Fragment>
	)
}