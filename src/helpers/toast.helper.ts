import Swal from 'sweetalert2';

export const Toast: any = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  allowEscapeKey: false,
  timer: 1500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});
