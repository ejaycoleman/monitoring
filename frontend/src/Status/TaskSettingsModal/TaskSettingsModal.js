import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormGroup from '@material-ui/core/FormGroup'
import Switch from '@material-ui/core/Switch'
import CircularProgress from '@material-ui/core/CircularProgress'
import Backdrop from '@material-ui/core/Backdrop'
import Snackbar from '@material-ui/core/Snackbar'
import Dialog from '@material-ui/core/Dialog'
import { modifyTask, removeTask } from '../../actions'
import { useDispatch } from 'react-redux'

export default function TaskSettingsModal(props) {
	const { close, task, modifyTaskProp, removeTaskProp } = props
	const [command, setCommand] = React.useState(task.command);
	const [frequency, setFrequency] = React.useState(task.frequency);
	const [period, setPeriod] = React.useState(task.period);
	const [enabled, setEnabled] = React.useState(task.enabled);
	const [loading, setLoading] = React.useState(false)
	const [error, setError] = React.useState('')
	const [deleteConfirmDialog, setDeleteConfirmDialog] = React.useState(false)
	const dispatch = useDispatch()

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
				{enabled ? 'enabled' : 'disabled'}
				<Switch checked={enabled} onChange={() => setEnabled(!enabled)} />
				<Button style={{float: 'right'}} onClick={() => setDeleteConfirmDialog(true)} variant="contained" color="secondary">
					Delete Task
				</Button>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => close()} color="primary">
					Cancel
				</Button>
				{(command !== task.command || frequency !== task.frequency || period !== task.period || enabled !== task.enabled) && (
					<Button onClick={() => {
						try {
							modifyTaskProp(task.number, command, frequency, period, enabled).then(({data: { modifyTask: {number, command, frequency, period, enabled} }}) => {
							
								dispatch(modifyTask({number, command, frequency, period, enabled}))
								close()
							}).catch(e => console.log(e))
						} catch(e) {
							setError(e.message)
						}						
					}}>
						Apply
					</Button>
				)}
			</DialogActions>
			<Dialog
				open={deleteConfirmDialog}
				onClose={() => setDeleteConfirmDialog(false)}
			>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete task #{task.number}?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteConfirmDialog(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={() => {
						setLoading(true)
						removeTaskProp(task.number).then(data => {
							setLoading(false)
							dispatch(removeTask(task.number))
							setDeleteConfirmDialog(false)
							close()	
						}).catch(e => console.log(e))						
					}} variant="contained" color="secondary">
						Delete
					</Button>
					<Backdrop open={loading} style={{zIndex: 99999999}}>
						<CircularProgress color="inherit" />
					</Backdrop>
				</DialogActions>
			</Dialog>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={!!error}
				onClose={() => setError('')}
				message={`⚠️ ${error}`}
			/>
		</React.Fragment>
	)
}