import Swal from 'sweetalert2';

// Custom styled SweetAlert2 utility functions

/**
 * Show a success message
 * @param {string} title - The title of the alert
 * @param {string} text - The message text
 * @param {number} timer - Auto close timer in milliseconds (default: 3000)
 */
export const showSuccess = (title, text, timer = 3000) => {
    return Swal.fire({
        title,
        text,
        icon: 'success',
        timer,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
            popup: 'swal-popup-success',
            title: 'swal-title',
            htmlContainer: 'swal-text'
        }
    });
};

/**
 * Show an error message
 * @param {string} title - The title of the alert
 * @param {string} text - The message text
 */
export const showError = (title, text) => {
    return Swal.fire({
        title,
        text,
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
            popup: 'swal-popup-error',
            title: 'swal-title',
            htmlContainer: 'swal-text',
            confirmButton: 'swal-button'
        }
    });
};

/**
 * Show a warning message
 * @param {string} title - The title of the alert
 * @param {string} text - The message text
 */
export const showWarning = (title, text) => {
    return Swal.fire({
        title,
        text,
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
            popup: 'swal-popup-warning',
            title: 'swal-title',
            htmlContainer: 'swal-text',
            confirmButton: 'swal-button'
        }
    });
};

/**
 * Show an information message
 * @param {string} title - The title of the alert
 * @param {string} text - The message text
 */
export const showInfo = (title, text) => {
    return Swal.fire({
        title,
        text,
        icon: 'info',
        confirmButtonText: 'OK',
        customClass: {
            popup: 'swal-popup-info',
            title: 'swal-title',
            htmlContainer: 'swal-text',
            confirmButton: 'swal-button'
        }
    });
};

/**
 * Show a confirmation dialog
 * @param {string} title - The title of the alert
 * @param {string} text - The message text
 * @param {string} confirmButtonText - Text for the confirm button
 * @param {string} cancelButtonText - Text for the cancel button
 * @returns {Promise} - Resolves with boolean value based on user's choice
 */
export const showConfirm = (title, text, confirmButtonText = 'Yes', cancelButtonText = 'No') => {
    return Swal.fire({
        title,
        text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        customClass: {
            popup: 'swal-popup-confirm',
            title: 'swal-title',
            htmlContainer: 'swal-text',
            confirmButton: 'swal-button-confirm',
            cancelButton: 'swal-button-cancel'
        }
    }).then((result) => {
        return result.isConfirmed;
    });
};

/**
 * Show a toast notification
 * @param {string} title - The title of the toast
 * @param {string} icon - The icon type ('success', 'error', 'warning', 'info')
 * @param {number} timer - Auto close timer in milliseconds (default: 3000)
 */
export const showToast = (title, icon = 'success', timer = 3000) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    return Toast.fire({
        icon,
        title
    });
};

// Default export with all methods
const SweetAlert = {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    confirm: showConfirm,
    toast: showToast
};

export default SweetAlert;