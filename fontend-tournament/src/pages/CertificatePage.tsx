import { Button, Container, FormControl, Input, Select, Option, Box, IconButton, Modal, ModalClose, ModalDialog, Radio, Chip } from "@mui/joy";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Alert2 from "../components/Alert2";
import { createAndUpdateCertificateOne, getCertificate, removeCertificate } from "../store/features/certificateSlice";
import { Certificate } from "../components/models/Certificate";
import Swal from "sweetalert2";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Grid } from "@mui/material";
import { createAndUpdateTextInImage, getTextInImage } from "../store/features/textInImageSlice";
import { createAndUpdateSignerDetail, getSignerDetail } from "../store/features/signerSlice";
import { useDropzone } from "react-dropzone";
import { folderImage } from "../components/api/agent";
import SignaturePad from "react-signature-canvas";
import SignatureCanvas from "react-signature-canvas";
import EditIcon from '@mui/icons-material/Edit';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

export default function CertificatePage() {
  const { Certificates } = useAppSelector((state) => state.certificate);
  const [searchName, setSearchName] = useState<number | null>(0);
  const [searchRank, setSearchRank] = useState<number | null>(0);
  const [searchLevel, setSearchLevel] = useState<number | null>(0);
  const [searchSchool, setSearchSchool] = useState<string>("");
  const [searchCompetitorFullName, setSearchCompetitorFullName] = useState<string>("");
  const [searchTrainerFullName, setSearchTrainerFullName] = useState<string>("");
  const { user } = useAppSelector((state) => state.user);
  const { levels } = useAppSelector((state) => state.level);
  const { teams } = useAppSelector((state) => state.team);
  const { SignerDetails } = useAppSelector((state) => state.signer);
  const { TextInImages } = useAppSelector((state) => state.textInImage);
  const { Competitions } = useAppSelector((state) => state.competition);
  const [filterResult, setFilterResult] = useState<Certificate[]>([]);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [certificateId, setCertificateId] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [rank, setRank] = useState<string>("");
  const [teamId, setTeamId] = useState<number>(0);
  const [listSignerDetails, setListSignerDetails] = useState<any[]>([]);
  const [textInImageCerId, setTextInImageCerId] = useState<number | null>(0);

  const [openTextInImageModal, setOpenTextInImageModal] = useState(false);
  const [textInImageId, setTextInImageId] = useState<number | null>(0);
  const [nameText, setNameText] = useState<string>("");

  const [selectedValue, setSelectedValue] = useState('a');
  const [selectedAUValue, setSelectedAUValue] = useState('a');

  const [openSignerModal, setOpenSignerModal] = useState(false);
  const [signerId, setSignerId] = useState<number | null>(0);
  const [fullName, setFullName] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [signatureImageUrl, setSignatureImageUrl] = useState<string | File>("");
  const [dataURL, setDataURL] = useState<string | null>(null);

  const [ date ] = useState(new Date());
  const currentYear = date.getFullYear() + 543;
  const maxYear = currentYear;
  const [year, setYear] = useState<number>(maxYear);
  const years = [];

  for (let i = maxYear; i >= currentYear - 20; i--) {
    years.push(i);
  }
  const findTeam = (teamId: number) => {
    return teams && teams.find(x => x.id === teamId)
  }

  const getTeamDetails = (teamId:number) => {
    const team = teams.find((t) => t.id === teamId);
    return team ? {
      schoolName: team.schoolName,
      listMembers: Array.isArray(team.listMembers) ? team.listMembers : [team.listMembers], // แปลงเป็นอาร์เรย์
      listTrainers: Array.isArray(team.listTrainers) ? team.listTrainers : [team.listTrainers], // แปลงเป็นอาร์เรย์
      levelId: team.levelId,
    } : {
      schoolName: 'ไม่พบข้อมูล',
      listMembers: [],
      listTrainers: [],
      levelId: 'ไม่พบข้อมูล',
    };
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };
  const handleAUChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAUValue(event.target.value);
  };

  const padRef = useRef<SignatureCanvas>(null);
  const clear = () => {
    padRef.current?.clear();
  };

  const trim = () => {
    const canvas = padRef.current?.getTrimmedCanvas();
    const url = canvas?.toDataURL("image/png");

    if (url) {
      setDataURL(url);

      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "signature.png", { type: "image/png" });
          setSignatureImageUrl(file);
        });
    }
  };

  useEffect(() => {
    if (!Certificates) {
      setFilterResult([]);
      return;
    }
  
    const getRankString = (rank:number|null) => {
      switch (rank) {
        case 1: return "รางวัลชนะเลิศ";
        case 2: return "รางวัลรองชนะเลิศ อันดับที่ 1";
        case 3: return "รางวัลรองชนะเลิศ อันดับที่ 2";
        default: return "รางวัลชมเชย";
      }
    };
  
    const filtered = Certificates.filter(x => {
      const competition = Competitions.find(c => c.id === searchName);
      const rankString = getRankString(searchRank);

      const matchesYear = year === 0 || new Date(x.dateTime).getFullYear() + 543 === year;
      const matchesCompetition = searchName === 0 || x.name === competition?.name;
      const matchesRank = searchRank === 0 || x.rank === rankString;
      const matchesLevel = searchLevel === 0 || teams.some(c => c.levelId === searchLevel && c.id === x.teamId);
      const matchesSchool = searchSchool === "" || teams.some(c => c.schoolName.includes(searchSchool) && c.id === x.teamId);
      const matchesCompetitor = searchCompetitorFullName === "" || teams.some(c => c.listMembers.some(m => m.name.includes(searchCompetitorFullName)) && c.id === x.teamId);
      const matchesTrainer = searchTrainerFullName === "" || teams.some(c => c.listTrainers.some(t => t.name.includes(searchTrainerFullName)) && c.id === x.teamId);

      return matchesYear && matchesCompetition && matchesRank && matchesLevel && matchesSchool && matchesCompetitor && matchesTrainer;
    });
  
    setFilterResult(filtered);
  }, [Certificates, year, searchName, searchRank, searchLevel, searchSchool, searchCompetitorFullName, searchTrainerFullName]);
  

  const columns: GridColDef[] = [
    {
      field: 'id', // เปลี่ยนชื่อ field เป็น 'index'
      headerName: '#', // เปลี่ยน headerName ตามที่ต้องการ
      width: 50,
    },
    { field: 'name', headerName: 'รายการ', width: 130 },
    { field: 'rank', headerName: 'อันดับ', width: 130 },
    {
      field: 'levelId',
      headerName: 'ระดับ',
      width: 120,
      renderCell: (params) => {
        const { levelId } = getTeamDetails(params.row.teamId);
        return <div>{levels && levels.find(x=>x.id === levelId)?.name}</div>;
      },
    },
    {
      field: 'teamId',
      headerName: 'โรงเรียน',
      width: 150,
      renderCell: (params) => {
        const { schoolName } = getTeamDetails(params.value);
        return <div>{schoolName}</div>;
      },
    },
    {
      field: 'listMembers',
      headerName: 'ชื่อ-สกุล ผู้เข้าแข่งขัน',
      width: 200,
      renderCell: (params) => {
        const { listMembers } = getTeamDetails(params.row.teamId);
        return (
          <ul>
            {listMembers.length > 0 ? listMembers.map((member, index) => (
              <li key={index}>{member.name}</li>
            )) : <li>ไม่พบข้อมูล</li>}
          </ul>
        );
      },
    },
    {
      field: 'listTrainers',
      headerName: 'ชื่อ-สกุล ผู้ฝึกสอน',
      width: 200,
      renderCell: (params) => {
        const { listTrainers } = getTeamDetails(params.row.teamId);
        return (
          <ul>
            {listTrainers.length > 0 ? listTrainers.map((trainer, index) => (
              <li key={index}>{trainer.name}</li>
            )) : <li>ไม่พบข้อมูล</li>}
          </ul>
        );
      },
    },
    {
      field: 'image',
      headerName: 'เกียรติบัตร',
      width: 160,
      renderCell: (params) => (
        params.value !== "" ? (
          <a href={params.value} download>
            <button style={{ cursor: 'pointer' }}>ดาวน์โหลดเกียรติบัตร</button>
          </a>
        ) : null
      ),
    },
    {
      field: 'Edit',
      headerName: '',
      width: 55,
      renderCell: (params) => {
        if (user && user.role === "Admin") {
          return (
            <IconButton
              color="primary"
              onClick={() => handleOpenAddModal(params.row.id)}
            >
              <AutoFixHighIcon />
            </IconButton>
          );
        }
        return null;
      },
    },
    {
      field: 'Remove',
      headerName: '',
      width: 55,
      renderCell: (params) => {
        if (user && user.role === "Admin") {
          return (
            <IconButton
              color="danger"
              onClick={async () => {
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
                    const item = await dispatch(removeCertificate(params.row.id))
                    if (item.payload !== "" && item.payload !== undefined) {
                      Swal.fire({
                        title: "ลบสำเร็จ!",
                        icon: "success"
                      });

                      setTimeout(async () => {
                        await dispatch(getCertificate());
                      }, 900);

                    } else {
                      Swal.fire({
                        title: "เกิดข้อผิดพลาด!",
                        icon: "error"
                      });
                    }
                  }
                });
                fetchData();
              }}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
          );
        }
        return null;
      }
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    await dispatch(getCertificate());
    await dispatch(getSignerDetail());
    await dispatch(getTextInImage());
  };
  const handleChangeName = (
    _event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setSearchName(newValue)
  };
  const handleChangeRank = (
    _event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setSearchRank(newValue)
  };
  const handleChangeLevel = (
    _event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setSearchLevel(newValue)
  };

  const handleOpenAddModal = (id?: number) => {
    setOpenAddModal(true);
    const certificate = Certificates && Certificates.find(x => x.id === id)
    if (certificate !== null && certificate !== undefined) {
      setCertificateId(certificate.id)
      setName(certificate.name)
      setRank(certificate.rank)
      setTeamId(certificate.teamId)
      setTextInImageCerId(certificate.textInImageId)
      if (certificate.listSignerDetails) setListSignerDetails(certificate.listSignerDetails.map(x => x.signerDetailId))
      else setListSignerDetails([])
    }
    else {
      setCertificateId(0)
      setName("")
      setRank("")
      setTeamId(0)
      setTextInImageCerId(0);
      setListSignerDetails([]);
    }
  }
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setCertificateId(0)
    setName("")
    setRank("")
    setTeamId(0)
    setListSignerDetails([]);
    setTextInImageCerId(0);
  }
  const cAUCertificate = async () => {
    if (name === "") {
      alert.alertCustom(2, 'กรุณาป้อนข้อมูลให้ครบ');
      return;
    }

    alert.showLoadingSpinner("กำลังบันทึกข้อมูล...");
    const item = await dispatch(createAndUpdateCertificateOne({ certificateId, name, rank, teamId, textInImageId:textInImageCerId, listSignerDetails }));
    alert.hideLoadingSpinner();
    if (item.payload !== "" && item.payload !== undefined) {
      alert.alertCustom(1,certificateId === 0 ? "สร้างเกียรติบัตรสำเร็จ" : "แก้ไขเกียรติบัตรสำเร็จ" );

      setTimeout(async () => {
        await dispatch(getCertificate());
      }, 900);

      handleCloseAddModal();
    } else {
      alert.alertCustom(2, "เกิดข้อผิดพลาด!");
    }
  };
  const handleOpenTextInImageModal = (id?: number) => {
    setOpenTextInImageModal(true);

    const textInImage = TextInImages && TextInImages.find(x => x.id === id)
    if (textInImage !== null && textInImage !== undefined) {
      setTextInImageId(textInImage.id)
      setNameText(textInImage.text)

    }
    else {
      setTextInImageId(0)
      setNameText("")
    }
  }
  const handleCloseTextInImageModal = () => {
    setOpenTextInImageModal(false);
    setTextInImageId(0)
    setNameText("")
  }
  const handleOpenSignerModal = (id?: number) => {
    setOpenSignerModal(true);

    const signerDetail = SignerDetails && SignerDetails.find(x => x.id === id)
    if (signerDetail !== null && signerDetail !== undefined) {
      setSignerId(signerDetail.id)
      setFullName(signerDetail.fullName)
      setPosition(signerDetail.position)
      setSignatureImageUrl(signerDetail.signatureImageUrl)
    }
    else {
      setSignerId(0)
      setFullName("")
      setPosition("")
      setSignatureImageUrl("")
    }
  }

  const handleCloseSignerModal = () => {
    setOpenSignerModal(false);
    setSignerId(0)
    setFullName("")
    setPosition("")
    setSignatureImageUrl("")
    setDataURL("")
  }

  const alert = Alert2()
  const dispatch = useAppDispatch()

  const cAUTextInImage = async () => {
    if (nameText === "") {
      alert.alertCustom(2, 'กรุณาป้อนข้อมูลให้ครบ');
      return;
    }
    const item = await dispatch(createAndUpdateTextInImage({ textInImageId, nameText }));
    if (item.payload !== "" && item.payload !== undefined) {
      alert.alertCustom(1, textInImageId === 0 ? "สร้างข้อความสำเร็จ" : "แก้ไขข้อความสำเร็จ");

      setTimeout(async () => {
        await dispatch(getTextInImage());
      }, 900);

      handleCloseTextInImageModal();
    } else {
      alert.alertCustom(2, "เกิดข้อผิดพลาด!");
    }
  };
  const cAUSigner = async () => {
    if (fullName === "" && position === "" && signatureImageUrl === "") {
      alert.alertCustom(2, 'กรุณาป้อนข้อมูลให้ครบ');
      return;
    }
    const item = await dispatch(createAndUpdateSignerDetail({ signerId, fullName, position, signatureImageUrl }));
    if (item.payload !== "" && item.payload !== undefined) {
      alert.alertCustom(1, signerId === 0 ? "สร้างลายเซ็นสำเร็จ" : "แก้ไขลายเซ็นสำเร็จ");

      setTimeout(async () => {
        await dispatch(getSignerDetail());
      }, 900);

      handleCloseSignerModal();
    } else {
      alert.alertCustom(2, "เกิดข้อผิดพลาด!");
    }
  };
  const handleCompetitionNameChange = (_:any, newValue: any) => {
    setName(newValue);

  };

  const handleRankChange = (_:any, newValue: any) => {
    setRank(newValue);
  };
  const handleTeamIdChange = (_:any, newValue: any) => {
    setTeamId(newValue);
  };
  const handleTextInImageCerChange = (_:any, newValue: any) => {
    setTextInImageCerId(newValue);
  };
  const handleSignersChange = (
    _event: React.SyntheticEvent | null,
    newValue: number | number[] | null,
  ) => {
    setListSignerDetails(newValue as number[]);
  };
  const handleTextInImageIdChange = (
    _event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    const textInImages = TextInImages && TextInImages.find(x => x.id === Number(newValue));
    if (textInImages) {
      setTextInImageId(newValue);
      setNameText(textInImages.text);
    }
    else {
      setTextInImageId(0);
      setNameText("");
    }
  };

  const handleSignerIdChange = (
    _event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    const signerDetail = SignerDetails && SignerDetails.find(x => x.id === Number(newValue));
    if (signerDetail) {
      setSignerId(newValue);
      setFullName(signerDetail.fullName);
      setPosition(signerDetail.position);
      setSignatureImageUrl(signerDetail.signatureImageUrl);
    }
    else {
      setSignerId(0);
      setFullName("");
      setPosition("");
      setSignatureImageUrl("");
    }
  };
  const getRootProp = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setSignatureImageUrl(acceptedFiles[0]);
      }
    },
    multiple: false,
  });
  const handleYearChange = (_:any, newValue: any) => {
    setYear(newValue);
  };
  return (
    <Container>
      <h1 style={{ textAlign: "center" }}>
        เกียรติบัตร​​ออนไลน์การประกวดแข่งขันงานสัปดาห์วิทยาศาสตร์ (ส่วนภูมิภาค)
        ประจำปี {year} มหาวิทยาลัยราชภัฏกาญจนบุรี
      </h1>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} sm={6} md={1.5}>
        <h4>ปี</h4>
        <Select
          value={year}
          onChange={handleYearChange}
          placeholder="กรุณาเลือกปี"
          sx={{ mb: 2 }} // เพิ่มระยะห่าง
        >
          {years.map((yearValue) => (
            <Option key={yearValue} value={yearValue}>
              {yearValue}
            </Option>
          ))}
        </Select>
        </Grid>
      </Grid>
      {user && user?.role === "Admin" &&
        <Box display="flex" justifyContent="center" marginBottom={2}>
          <FormControl sx={{ maxWidth: 200, margin: 1 }}>
            <h4 style={{ textAlign: "center" }}>เพิ่ม/แก้ไขข้อความเกียรติบัตร</h4>
            <IconButton onClick={() => handleOpenTextInImageModal()} variant="outlined">
            <AddCircleOutlineIcon color='success' />
              <div style={{ marginLeft: 5 }}></div>
              <EditIcon color='warning' />
            </IconButton>
          </FormControl>
          <FormControl sx={{ maxWidth: 200, margin: 1 }}>
            <h4 style={{ textAlign: "center" }}>เพิ่ม/แก้ไขลายเซ็น</h4>
            <IconButton onClick={() => handleOpenSignerModal()} variant="outlined">
            <AddCircleOutlineIcon color='success' />
              <div style={{ marginLeft: 5 }}></div>
              <EditIcon color='warning' />
            </IconButton>
          </FormControl>
        </Box>
      }
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl>
            <h4>รายการ</h4>
            <Select defaultValue={searchName} onChange={handleChangeName}>
              <Option value={0}>ทั้งหมด</Option>
              {Competitions && Competitions.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl >
            <h4>รางวัล</h4>
            <Select defaultValue={searchRank} onChange={handleChangeRank}>
              <Option value={0}>ทั้งหมด</Option>
              <Option value={1}>รางวัลชนะเลิศ</Option>
              <Option value={2}>รางวัลรองชนะเลิศ อันดับที่ 1</Option>
              <Option value={3}>รางวัลรองชนะเลิศ อันดับที่ 2</Option>
              <Option value={4}>รางวัลชมเชย</Option>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormControl >
            <h4>ชื่อ-สกุล ผู้เข้าแข่งขัน</h4>
            <Input
              placeholder="ค้นหา..."
              startDecorator={
                <Button sx={{ width: 35 }} variant="soft" color="neutral" disabled startDecorator={<SearchIcon />}></Button>
              }
              value={searchCompetitorFullName}
              onChange={(e) => setSearchCompetitorFullName(e.target.value)}
              sx={{ borderRadius: 8 }}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={1}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl >
            <h4>ระดับ</h4>
            <Select defaultValue={searchLevel} onChange={handleChangeLevel}>
              <Option value={0}>ทั้งหมด</Option>
              {levels && levels.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4.5}>
          <FormControl >
            <h4>โรงเรียน</h4>
            <Input
              placeholder="ค้นหา..."
              startDecorator={
                <Button sx={{ width: 35 }} variant="soft" color="neutral" disabled startDecorator={<SearchIcon />}></Button>
              }
              value={searchSchool}
              onChange={(e) => setSearchSchool(e.target.value)}
              sx={{ borderRadius: 8 }}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4.5}>
          <FormControl >
            <h4>ชื่อ-สกุล ผู้ฝึกสอน</h4>
            <Input
              placeholder="ค้นหา..."
              startDecorator={
                <Button sx={{ width: 35 }} variant="soft" color="neutral" disabled startDecorator={<SearchIcon />}></Button>
              }
              value={searchTrainerFullName}
              onChange={(e) => setSearchTrainerFullName(e.target.value)}
              sx={{ borderRadius: 8 }}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Paper sx={{ height: 400, width: '100%', marginTop: 3 }}>
        {filterResult && filterResult.length > 0 &&
          <DataGrid
            rows={filterResult}
            columns={columns}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            getRowId={(row) => `${row.someUniqueField}-${row.id}`}
            sx={{
              border: 0,
              '& .MuiDataGrid-cell': {
                whiteSpace: 'normal',
                lineHeight: '1.2',
                alignItems: 'center',
                display: 'flex',
                height: "auto",
                overflowY: "auto",
              },
            }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
          />
        }
      </Paper>


      <Modal open={openAddModal} onClose={handleCloseAddModal}>
        <ModalDialog sx={{
          width: { xs: '100%', sm: 600 }, // กว้าง 600 เมื่อหน้าจอขนาดกลางขึ้นไป
          maxWidth: '90%', // จำกัดความกว้างสูงสุดที่ 90% ของหน้าจอ
        }}>
          <ModalClose />
          <Box sx={{ overflow: 'auto', maxHeight: 600 }}>
            <Box>
              <h4>รายการ</h4>
              <Select
                value={name}
                onChange={handleCompetitionNameChange}
                placeholder="กรุณาเลือกหรือป้อนชื่อ"
                sx={{ mb: 2 }} // เพิ่มระยะห่าง
              >
                {Competitions && Competitions.map((c) => (
                  <Option key={c.id} value={c.name}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </Box>

            <Box>
              <h4>รางวัล</h4>
              <Select
                value={rank}
                onChange={handleRankChange}
                placeholder="กรุณาเลือกหรือป้อนระดับ"
                sx={{ mb: 2 }} // เพิ่มระยะห่าง
              >
                <Option value="รางวัลชนะเลิศ">รางวัลชนะเลิศ</Option>
                <Option value="รางวัลรองชนะเลิศ อันดับที่ 1">รางวัลรองชนะเลิศ อันดับที่ 1</Option>
                <Option value="รางวัลรองชนะเลิศ อันดับที่ 2">รางวัลรองชนะเลิศ อันดับที่ 2</Option>
                <Option value="รางวัลชมเชย">รางวัลชมเชย</Option>
              </Select>
            </Box>

            <Box>
             <h4>โรงเรียน</h4>
              <Select
                value={teamId}
                onChange={handleTeamIdChange}
                required
              >
                {teams && teams.map((l) => (
                  <Option key={l.id} value={l.id}>
                    {findTeam(l.id)?.schoolName}
                  </Option>
                ))}
              </Select>
            </Box>

            <Box>
             <h4>วันที่</h4>
              <Select
                value={textInImageCerId}
                onChange={handleTextInImageCerChange}
                required
              >
                {TextInImages && TextInImages.map((l) => (
                  <Option key={l.id} value={l.id}>
                    {l.text}
                  </Option>
                ))}
              </Select>
            </Box>

            <Box>
              <h4 style={{ marginTop: 5 }}>ลายเซ็น</h4>
              <Select
                multiple
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', gap: '0.25rem' }}>
                    {selected.map((selectedOption, index) => (
                      <Chip key={index} variant="soft" color="primary">
                        {selectedOption.label}
                      </Chip>
                    ))}
                  </Box>
                )}
                sx={{
                  minWidth: '15rem',
                }}
                slotProps={{
                  listbox: {
                    component: 'div',
                    sx: {
                      maxHeight: 240,
                      overflow: 'auto',
                      '--List-padding': '0px',
                      '--ListItem-radius': '0px',
                    },
                  },
                }}

                onChange={handleSignersChange}
                value={listSignerDetails}
              >
                {SignerDetails && SignerDetails.map((s) => (
                  <Option key={s.id} value={s.id}>
                    [{s.fullName}]
                  </Option>
                ))}
              </Select>
            </Box>
          </Box>
          <Box sx={{ textAlign: "end" }}>
            <Button
              variant="solid"
              color="primary"
              sx={{ mt: 2 }}
              onClick={cAUCertificate}
            >
              ยืนยัน
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      <Modal open={openTextInImageModal} onClose={handleCloseTextInImageModal}>
        <ModalDialog sx={{
          width: { xs: '100%', sm: 600 }, // กว้าง 600 เมื่อหน้าจอขนาดกลางขึ้นไป
          maxWidth: '90%', // จำกัดความกว้างสูงสุดที่ 90% ของหน้าจอ
        }}>
          <ModalClose />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Radio
              checked={selectedAUValue === 'a'}
              onChange={handleAUChange}
              value="a"
              name="radio-buttons"
              slotProps={{ input: { 'aria-label': 'A' } }}
              label="สร้าง"
            />
            <Radio
              checked={selectedAUValue === 'b'}
              onChange={handleAUChange}
              value="b"
              name="radio-buttons"
              slotProps={{ input: { 'aria-label': 'B' } }}
              label="แก้ไข"
            />
          </Box>
          {selectedAUValue === 'b' &&
            <Box>
              <h4>แก้ไข</h4>
              <Select
                value={textInImageId}
                onChange={handleTextInImageIdChange}
                required
                slotProps={{
                  listbox: {
                    component: 'div',
                    sx: {
                      maxHeight: 150,
                      overflow: 'auto',
                      '--List-padding': '0px',
                      '--ListItem-radius': '0px',
                    },
                  },
                }}
              >
                {TextInImages && TextInImages.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.text}
                  </Option>
                ))
                }
              </Select>
            </Box>
          }
          <Box sx={{ overflow: 'auto', maxHeight: 600 }}>
            <h4>ข้อความวันที่ในเกียรติบัตร</h4>
            <span>(ตัวอย่าง เช่น 21 - 23 สิงหาคม เป็นต้น)</span>
            <Input name="nameText" required value={nameText} onChange={(e) => setNameText(e.target.value)} />
          </Box>
          <Box sx={{ textAlign: "end" }}>
            <Button
              variant="solid"
              color="primary"
              sx={{ mt: 2 }}
              onClick={cAUTextInImage}
            >
              ยืนยัน
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      <Modal open={openSignerModal} onClose={handleCloseSignerModal}>
        <ModalDialog sx={{
          width: { xs: '100%', sm: 600 }, // กว้าง 600 เมื่อหน้าจอขนาดกลางขึ้นไป
          maxWidth: '90%', // จำกัดความกว้างสูงสุดที่ 90% ของหน้าจอ
        }}>
          <ModalClose />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Radio
              checked={selectedAUValue === 'a'}
              onChange={handleAUChange}
              value="a"
              name="radio-buttons"
              slotProps={{ input: { 'aria-label': 'A' } }}
              label="สร้าง"
            />
            <Radio
              checked={selectedAUValue === 'b'}
              onChange={handleAUChange}
              value="b"
              name="radio-buttons"
              slotProps={{ input: { 'aria-label': 'B' } }}
              label="แก้ไข"
            />
          </Box>
          {selectedAUValue === 'b' &&
            <Box>
              <h4>แก้ไข</h4>
              <Select
                value={signerId}
                onChange={handleSignerIdChange}
                required
                slotProps={{
                  listbox: {
                    component: 'div',
                    sx: {
                      maxHeight: 150,
                      overflow: 'auto',
                      '--List-padding': '0px',
                      '--ListItem-radius': '0px',
                    },
                  },
                }}
              >
                {SignerDetails && SignerDetails.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.fullName}
                  </Option>
                ))
                }
              </Select>
            </Box>
          }
          <Box sx={{ overflow: 'auto', maxHeight: 600 }}>
            <h4>ชื่อเต็ม</h4>
            <Input name="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <h4>ตำแหน่ง</h4>
            <Input name="position" required value={position} onChange={(e) => setPosition(e.target.value)} />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Radio
                checked={selectedValue === 'a'}
                onChange={handleChange}
                value="a"
                name="radio-buttons"
                slotProps={{ input: { 'aria-label': 'A' } }}
                label="เลือกรูปภาพลายเซ็น"
              />
              <Radio
                checked={selectedValue === 'b'}
                onChange={handleChange}
                value="b"
                name="radio-buttons"
                slotProps={{ input: { 'aria-label': 'B' } }}
                label="เขียนลายเซ็น"
              />
            </Box>
            {selectedValue === 'a' ?
              <div>
                <span>(ต้องเป็น jpg, png เป็นตัน)</span>
                <div {...getRootProp.getRootProps()} style={dropzoneStyles}>
                  <input {...getRootProp.getInputProps()} />
                  {signatureImageUrl ? (
                    <img src={typeof signatureImageUrl === 'string' ? folderImage + signatureImageUrl : URL.createObjectURL(signatureImageUrl)} alt="Preview" style={previewStyles} />
                  ) : (
                    <p>ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกหนึ่งภาพ</p>
                  )}
                </div>
              </div> :
              <div>
                <SignaturePad ref={padRef} canvasProps={{ className: "sigCanvas" }} />
                <div className="sigPreview">
                  <button onClick={trim}>บันทึก</button>
                  <button onClick={clear}>ล้าง</button>
                  {dataURL ? (
                    <img
                      className={"sigImage"}
                      src={dataURL}
                      alt="user generated signature"
                    />
                  ) : null}
                </div>
              </div>
            }
          </Box>
          <Box sx={{ textAlign: "end" }}>
            <Button
              variant="solid"
              color="primary"
              sx={{ mt: 2 }}
              onClick={cAUSigner}
            >
              ยืนยัน
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Container>
  )
}

const dropzoneStyles: any = {
  border: '2px dashed #ccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

const previewStyles: any = {
  maxWidth: '300px',
  maxHeight: '400px',
  marginTop: '10px',
};