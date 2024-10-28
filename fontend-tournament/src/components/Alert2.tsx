import Swal from 'sweetalert2';

export default function Alert2() {
  let loading:any;

  const alertCustom = (icon: number, text: string) => {
    Swal.fire({
      position: "center",
      icon: icon === 1 ? "success" : icon === 2 ? "error" : "info",
      title: text,
      showConfirmButton: false,
      timer: 1000,
    });
  };

  const showLoadingSpinner = (message: string) => {
    loading = Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  const hideLoadingSpinner = () => {
    if (loading) {
      loading.close();
    }
  };

  return {
    alertCustom,
    showLoadingSpinner,
    hideLoadingSpinner,
  };
}
