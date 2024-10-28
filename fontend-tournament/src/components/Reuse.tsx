import { useEffect, useState } from "react";

//#region chang number ","
export const formatNumberWithCommas = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
//#endregion

//#region validEmail
export const isValidEmail = (email:string) => {
  // ใช้ Regex เพื่อตรวจสอบรูปแบบของอีเมล
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
//#endregion

//#region Check Size Web
export const windowSizes = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [windowSize, setWindowSize] = useState(window.innerWidth);
  
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const handleResize = () => {
        setWindowSize(window.innerWidth);
      };
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [windowSize]);
    
    return windowSize;
};
//#endregion


//#region convertYear
export const convertToBuddhistYear = (dateString:string) => {
  const date = new Date(dateString);
  return `${date.getFullYear() + 543}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const convertToGregorianYear = (dateString:any) => {
  const [year, month, day] = dateString.split('-');
  return `${year - 543}-${month}-${day}`;
};

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  // ลบปี พ.ศ. 543 (ปรับเป็นปี ค.ศ.)
  const adjustedYear = date.getFullYear();
  // สร้างวัตถุ Date ใหม่โดยใช้ปีที่ปรับแล้ว
  const adjustedDate = new Date(date.setFullYear(adjustedYear));
  const options: any = { year: 'numeric', month: 'long', day: 'numeric' };
  return adjustedDate.toLocaleDateString('th-TH', options);
}
//#endregion
