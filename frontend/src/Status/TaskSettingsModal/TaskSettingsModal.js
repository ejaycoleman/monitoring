import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormGroup from '@material-ui/core/FormGroup'
import Switch from '@material-ui/core/Switch'

export default function TaskSettingsModal(props) {
	const { close, task } = props

	const [command, setCommand] = React.useState(task.command);
	const [frequency, setFrequency] = React.useState(task.frequency);
	const [period, setPeriod] = React.useState(task.period);
	const [active, setActive] = React.useState(true);

	return (
		<React.Fragment>
			<DialogContent>
				<DialogContentText>
					Modify task #{task.number}
				</DialogContentText>
				<FormGroup row style={{marginTop: 20, marginBottom: 25}}>
					<TextField
						label="Command"
						type="text"
						placeholder="command"
						value={command} onChange={e => setCommand(e.target.value)}
					/>
					<TextField
						label="Frequency"
						type="number"
						placeholder="frequency"
						value={frequency} onChange={e => setFrequency(parseInt(e.target.value))}
					/>
					<NativeSelect label="Period" value={period} onChange={e => setPeriod(e.target.value)}>
						<option value="days">days</option>
						<option value="weeks">weeks</option>
						<option value="months">months</option>
					</NativeSelect>
				</FormGroup>
				{active ? 'enabled' : 'disabled'}
				<Switch
					checked={active}
					onChange={() => setActive(!active)}
					color="primary"
					name="checkedB"
					inputProps={{ 'aria-label': 'primary checkbox' }}
				/>
				<Button style={{float: 'right'}} onClick={() => close()} variant="contained" color="secondary">
					Delete Task
				</Button>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => close()} color="primary">
					Cancel
				</Button>
				{ (command !== task.command || frequency !== task.frequency || period !== task.period || active !== true) && (
					<Button onClick={() => close()}>
						Apply
					</Button>
				)}
			</DialogActions>
		</React.Fragment>
	)
}