import Swal from 'sweetalert2';

/**
 * Custom styled SweetAlert2 configuration for the application
 */
const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#1e293b', // Slate 800
  color: '#f1f5f9', // Slate 100
  padding: '1rem',
  customClass: {
    popup: 'rounded-2xl border border-white/[0.05] shadow-2xl shadow-black/50',
  },
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
      iconColor: '#6366f1', // Indigo 500
    });
  },
  error: (title: string) => {
    Toast.fire({
      icon: 'error',
      title,
      iconColor: '#f87171', // Red 400
    });
  },
  info: (title: string) => {
    Toast.fire({
      icon: 'info',
      title,
      iconColor: '#38bdf8', // Sky 400
    });
  },
  confirm: async (title: string, text: string, icon: 'warning' | 'error' | 'info' | 'question' | 'success' = 'warning', iconColor?: string) => {
    return Swal.fire({
      title,
      text,
      icon,
      iconColor,
      showCancelButton: true,
      confirmButtonColor: icon === 'error' || iconColor === '#ef4444' || iconColor === '#f87171' ? '#ef4444' : '#6366f1', // Use red for error/danger
      cancelButtonColor: '#334155', // Slate 700
      confirmButtonText: 'Yes, proceed',
      background: '#0f172a', // Slate 900
      color: '#f1f5f9', // Slate 100
      padding: '2rem',
      customClass: {
        popup: 'rounded-[2rem] border border-white/[0.05] shadow-2xl shadow-black/50',
        title: 'text-xl font-bold tracking-tight',
        htmlContainer: 'text-slate-400 text-sm font-medium',
        confirmButton: 'rounded-xl px-8 py-3 text-sm font-bold uppercase tracking-wider',
        cancelButton: 'rounded-xl px-8 py-3 text-sm font-bold uppercase tracking-wider'
      }
    });
  }
};
