import Swal from 'sweetalert2';

export default function Alert2() {
  const alertCustom = (icon:number, text:string) => {
    Swal.fire({
      position: "center",
      icon: icon === 1 ? "success" : icon === 2 ? "error" : "info",
      title: text,
      showConfirmButton: false,
      timer: 1000
    });
  }
  
  return {
    alertCustom,
  }
}
