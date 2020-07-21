import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormGroup from '@material-ui/core/FormGroup'
import Switch from '@material-ui/core/Switch'
import { modifyTask, removeTask } from '../../actions'
import { useDispatch } from 'react-redux'
import Notification from '../../Notfication/Notification'
import InteractiveModal from '../../InteractiveModal/InteractiveModal'
import WarningIcon from '@material-ui/icons/Warning'

export default function TaskSettingsModal(props) {
	const { close, task, modifyTaskProp, removeTaskProp } = props
	const [command, setCommand] = React.useState(task.command);
	const [frequency, setFrequency] = React.useState(task.frequency);
	const [period, setPeriod] = React.useState(task.period);
	const [enabled, setEnabled] = React.useState(task.enabled);
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
				{ task.approved && (enabled ? 'enabled' : 'disabled')}
				{ task.approved && <Switch checked={enabled} onChange={() => setEnabled(!enabled)} /> }
				<Button style={{float: 'right'}} onClick={() => setDeleteConfirmDialog(true)} variant="contained" color="secondary">
					{task.approved ? 'Delete' : 'Reject'} Task
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
			<InteractiveModal show={deleteConfirmDialog} onClose={() => setDeleteConfirmDialog(false)}>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to {task.approved ? 'delete' : 'reject'} task #{task.number}?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteConfirmDialog(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={() => {
						removeTaskProp(task.number).then(data => {
							dispatch(removeTask(task.number))
							setDeleteConfirmDialog(false)
							close()	
						}).catch(e => console.log(e))						
					}} variant="contained" color="secondary">
						{task.approved ? 'Delete' : 'Reject'}
					</Button>
				</DialogActions>
			</InteractiveModal>
			<Notification show={!!error} onClose={() => setError('')}><WarningIcon style={{color: '#F2A83B'}}/> {error}</Notification> 
		</React.Fragment>
	)
}