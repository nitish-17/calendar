import Swal from 'sweetalert2';

/**
 * Custom styled SweetAlert2 configuration for the application
 */
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#1e1e1e',
  color: '#ffffff',
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export const notify = {
  success: (title: string) => {
    Toast.fire({
      icon: 'success',
      title,
      iconColor: '#a855f7', // brand-primary
    });
  },
  error: (title: string) => {
    Toast.fire({
      icon: 'error',
      title,
      iconColor: '#ef4444',
    });
  },
  info: (title: string) => {
    Toast.fire({
      icon: 'info',
      title,
      iconColor: '#3b82f6',
    });
  },
  confirm: async (title: string, text: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#a855f7',
      cancelButtonColor: '#333333',
      confirmButtonText: 'Yes, proceed',
      background: '#1e1e1e',
      color: '#ffffff',
    });
  }
};
