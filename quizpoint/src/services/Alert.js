/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
import Swal from 'sweetalert2'
import './Alert.css'


let alert = {
    success: (title, text) => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-right',
            iconColor: 'white',
            customClass: {
                popup: 'colored-toast'
            },
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        })
        Toast.fire({
            icon: 'success',
            title: title,
        })
    },
    error: (title, text) => {
        Swal.fire({
            title: 'Error - ' + title,
            text: text,
            icon: 'error',
            confirmButtonText: 'Ok'
        })
    },
    warning: (title, text) => { },
}

export {
    alert
}