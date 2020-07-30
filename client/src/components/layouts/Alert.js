import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { removeAlert } from '../../actions/alert'

const Alert = ({ alerts, msg, removeAlert }) =>
    alerts !== null && alerts.length > 0 && alerts.map(alert => (
        <div
            className={msg}
            key={alert.id}
            data-alert-id={alert.id}
            title='Click Me To Remove Me.'
            onClick={e => removeAlert(e.target.getAttribute('data-alert-id'))}
        >
            {alert.msg}
        </div>
    ))

Alert.propTypes = {
    alerts: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
    alerts: state.alert,
    removeAlert: PropTypes.func.isRequired
})

export default connect(mapStateToProps, { removeAlert })(Alert)
