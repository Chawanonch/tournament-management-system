import { Button, Container, FormControl, IconButton, Modal, ModalClose, ModalDialog, Textarea } from "@mui/joy";
import { useAppDispatch, useAppSelector } from "../store/store";
import Slider from "react-slick";  // นำเข้า react-slick
import { Box } from "@mui/material";  // ใช้ Box และ Typography จาก MUI
import { folderImage } from "../components/api/agent";  // ใช้สำหรับ URL ของภาพ
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import Alert2 from "../components/Alert2";
import { createAndUpdateHomeImage, getHomeImage, removeHomeImage } from "../store/features/homeImageSlice";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Swal from "sweetalert2";

export default function HomePage() {
  const { HomeImages } = useAppSelector((state) => state.homeImage); // ดึงข้อมูล HomeImages จาก Redux store
  const [images, setImages] = useState<Array<string | File>>([]);
  const [text, setText] = useState<string>('');
  const [id, setId] = useState<number>(0);
  const [openHomeModal, setOpenHomeModal] = useState<boolean>(false);
  const alert = Alert2()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user);

  const settings = {
    dots: true,  // แสดงจุดเลื่อน
    speed: 500,  // ความเร็วในการเลื่อน
    slidesToShow: 1,  // แสดง 1 รูปในแต่ละครั้ง
    slidesToScroll: 1,  // เลื่อนทีละ 1 สไลด์
  };

  const getRootProps = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setImages(acceptedFiles);
      }
    },
    multiple: true,
  });

  const handleOpenHomeModal = (id?:number) => {
    setOpenHomeModal(true);
    if(id){
      const homeImage = HomeImages && HomeImages.find(x=>x.id === id);
      if(homeImage){
        setId(id)
        setImages(homeImage.hoomImages.length > 0 ? homeImage.hoomImages.map(x=>x.image) : [])
        setText(homeImage.text)
      }else{
        setId(0)
        setImages([])
        setText("")
      }
    }
  };

  const handleCloseHomeModal = () => {
    setOpenHomeModal(false);
    setId(0)
    setImages([])
    setText("")
  };

  const cAUHomeImage = async () => {
    if (text == "" || images.length <= 0) {
      alert.alertCustom(2, 'กรุณาป้อนข้อมูลให้ครบ');
      return;
    }
    const item = await dispatch(createAndUpdateHomeImage({ id, text, images}));
    if (item.payload !== "" && item.payload !== undefined) {
      alert.alertCustom(1, id === 0 ? "สร้างหน้าหลักสำเร็จ" : "แก้ไขหน้าหลักสำเร็จ");

      setTimeout(async () => {
        await dispatch(getHomeImage());
      }, 900);

      handleCloseHomeModal();
    } else {
      alert.alertCustom(2, "เกิดข้อผิดพลาด!");
    }
  };
  const removeHomeImagesById = async (id: number) => {
    Swal.fire({
      title: "คุณต้องการลบใช่ไหม",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่ ฉันต้องการลบ",
      cancelButtonText: "ยกเลิก"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const item = await dispatch(removeHomeImage(id));
        if (item.payload !== "" && item.payload !== undefined) {
          Swal.fire({
            title: "ลบสำเร็จ!",
            icon: "success"
          });

          setTimeout(async () => {
            await dispatch(getHomeImage());
          }, 900);

        } else {
          Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            icon: "error"
          });
        }
      }
    });
  };

  return (
    <Container>
      {user && user?.role === "Admin" && (
        <FormControl sx={{ maxWidth: 200, margin: 1 }}>
          <h4 style={{ textAlign: "center" }}>สร้างข้อมูลหน้าหลัก</h4>
          <IconButton onClick={() => handleOpenHomeModal()} variant="outlined">
            <AddCircleOutlineIcon color='success' />
          </IconButton>
        </FormControl>
      )}

      {HomeImages && HomeImages.map((item) => {
        return (
          <Box key={item.id} sx={{ marginTop: 3, borderRadius: 2, boxShadow: 3, padding: 2 }}>
            {user && user?.role === "Admin" && (
              <FormControl sx={{ maxWidth: 200, marginBottom: 2 }}>
                <h4 style={{ textAlign: "center" }}>แก้ไขข้อมูลหน้าหลัก</h4>
                <IconButton onClick={() => handleOpenHomeModal(item.id)} variant="outlined">
                  <EditIcon color='warning' />
                </IconButton>
                <h4 style={{ textAlign: "center" }}>ลบข้อมูลหน้าหลัก</h4>
                <IconButton onClick={() => removeHomeImagesById(item.id)} variant="outlined">
                  <RemoveCircleOutlineIcon color='error' />
                </IconButton>
              </FormControl>
            )}

            <Slider {...settings}>
              {item.hoomImages && item.hoomImages.map((image) => (
                  <img
                    key={image.id}
                    src={typeof image.image === 'string' ? folderImage + image.image : URL.createObjectURL(image.image)}
                    alt={`Slide ${image.id}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  />
              ))}
            </Slider>
            <p style={{ textAlign: 'center', marginTop: 50, fontStyle: 'italic' }}>{item.text}</p>
          </Box>
        );
      })}

      <Modal open={openHomeModal} onClose={handleCloseHomeModal}>
        <ModalDialog sx={{
          width: { xs: '100%', sm: 600 }, // กว้าง 600 เมื่อหน้าจอขนาดกลางขึ้นไป
          maxWidth: '90%', // จำกัดความกว้างสูงสุดที่ 90% ของหน้าจอ
        }}>
          <ModalClose />
          <Box sx={{ overflow: 'auto', maxHeight: 600 }}>
            <h4>หลายรูปภาพ (**ควรใส่ 2 รูปภาพขึ้นไป)</h4>
            <div {...getRootProps.getRootProps()} style={dropzonesStyles}>
              <input {...getRootProps.getInputProps()} />
              {images.length > 0 ? (
                images.map((image, index) => (
                  <div key={index}>
                    {image && (
                      <img src={typeof image === 'string' ? folderImage + image : URL.createObjectURL(image)} alt="Preview" style={previewsStyles} />
                    )}
                  </div>
                ))
              ) : (
                <p>ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกหลายภาพสไลด์</p>
              )}

            </div>

            <h4>ข้อความที่จะแสดงในหน้าหลัก</h4>
            <Textarea name="text" required value={text} minRows={2} maxRows={5} onChange={(e) => setText(e.target.value)} style={{ whiteSpace: 'pre-wrap' }} />
            <Box sx={{ textAlign: "end" }}>
              <Button
                variant="solid"
                color="primary"
                sx={{ mt: 2 }}
                onClick={cAUHomeImage}
              >
                ยืนยัน
              </Button>
            </Box>
          </Box>
        </ModalDialog>
      </Modal>
    </Container>
  );
}
export const dropzonesStyles: object = {
  border: '2px dashed #ccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  display: 'flex',
  flexWrap: 'wrap',
};

export const previewsStyles: object = {
  maxWidth: '200px',
  maxHeight: '200px',
  objectFit: 'cover',
  marginLeft: '5px',
};