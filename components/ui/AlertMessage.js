import React, { useEffect } from 'react';
import SweetAlert from '@/utils/sweetAlert';

const AlertMessage = ({ error, success, showAlert }) => {
    // Use SweetAlert2 to display messages when they change
    useEffect(() => {
        if (showAlert) {
            if (error) {
                SweetAlert.error('Error', error);
            } else if (success) {
                SweetAlert.success('Success', success);
            }
        }
    }, [error, success, showAlert]);

    // This component no longer renders anything visible
    // as the alerts are shown via SweetAlert2 modals
    return null;
};

export default AlertMessage;