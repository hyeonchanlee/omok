import React, { Component } from 'react';


class Alerts extends Component {

    render() {
        // Error Alert
        if(this.props.alerts.error !== '') {
            return (
                <div className='alert alert-danger alert-dismissible' role='alert'>
                    <button type='button' className='close' onClick={this.props.clearAlerts}>&times;</button>
                    <p>{this.props.alerts.error}</p>
                </div>
            );        
        }
        // Warning Alert
        if(this.props.alerts.warning !== '') {
            return (
                <div className='alert alert-warning alert-dismissible' role='alert'>
                    <button type='button' className='close' onClick={this.props.clearAlerts}>&times;</button>
                    <p>{this.props.alerts.warning}</p>
                </div>
            );        
        }
        // Success Alert
        if(this.props.alerts.success !== '') {
            return (
                <div className='alert alert-success alert-dismissible' role='alert'>
                    <button type='button' className='close' onClick={this.props.clearAlerts}>&times;</button>
                    <p>{this.props.alerts.success}</p>
                </div>
            );        
        }

        // If there is no alert, return null
        return null;
    }
}

export default Alerts;