import React from 'react'

class Status extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            tasks: {}
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.tasks !== prevProps.tasks) {
            console.log(this.props.tasks)
        }
    }

    render() {
        return (
            <div>
                <h2 className="mv3">Status</h2>
                <h2>{JSON.stringify(this.props.tasks)}</h2>
            </div>
        ) 
    }
}

export default Status