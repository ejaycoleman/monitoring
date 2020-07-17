import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormGroup from '@material-ui/core/FormGroup'
import Notification from '../../Notfication/Notification'
import WarningIcon from '@material-ui/icons/Warning'

export default function PreferencesModal(props) {
	const {close, preferences: { preference }, setPreferences } = props
	const [idealFreq, setIdealFreq] = React.useState(preference ? preference.executionThresholdIdeal.split("-")[0] : '1')
	const [idealPeriod, setIdealPeriod] = React.useState(preference ? preference.executionThresholdIdeal.split("-")[1] : 'days')
	const [absoluteFreq, setAbsoluteFreq] = React.useState(preference ? preference.executionThresholdAbsolute.split("-")[0] : '10')
	const [absolutePeriod, setAbsolutePeriod] = React.useState(preference ? preference.executionThresholdAbsolute.split("-")[1] : 'days')	
	const [snackBarErrorShow, setSnackBarErrorShow] = React.useState(false)

	return (
		<React.Fragment>
			<DialogContent>
				<DialogContentText>
					Change the threshold for when to expect executions
				</DialogContentText>
				<FormGroup row>
					<TextField
						label="Ideally no later than..."
						type="number"
						placeholder="frequency"
						value={idealFreq} onChange={e => setIdealFreq(e.target.value)}
					/>
					<NativeSelect value={idealPeriod} onChange={e => setIdealPeriod(e.target.value)}>
						<option value="days">days ago</option>
						<option value="weeks">weeks ago</option>
						<option value="months">months ago</option>
					</NativeSelect>
				</FormGroup>
				<FormGroup row>
					<TextField
						label="No later than..."
						type="number"
						placeholder="frequency"
						value={absoluteFreq} onChange={e => setAbsoluteFreq(e.target.value)}
					/>
					<NativeSelect value={absolutePeriod} onChange={e => setAbsolutePeriod(e.target.value)}>
						<option value="days">days ago</option>
						<option value="weeks">weeks ago</option>
						<option value="months">months ago</option>
					</NativeSelect>
				</FormGroup>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => close()} color="primary">
					Cancel
				</Button>
				<Button onClick={() => {
					const multiplier = {days: 1, weeks: 7, months: 30}
					if (parseInt(absoluteFreq) * multiplier[absolutePeriod] < parseInt(idealFreq) * multiplier[idealPeriod]) {
						setSnackBarErrorShow(true)
						return
					}
					setPreferences(idealFreq, idealPeriod, absoluteFreq, absolutePeriod).then(() => close()).catch(err => console.log(err))
					}} color="primary">
					Apply
				</Button>
			</DialogActions>
			<Notification show={snackBarErrorShow} onClose={() => setSnackBarErrorShow(false)}><WarningIcon style={{color: '#F2A83B'}}/> Absolute must be greater than ideal!</Notification> 
		</React.Fragment>
	)
}