import { Container, Card, CardContent, FormControl, IconButton, Box, Input, Modal, ModalClose, ModalDialog, Option, Button, Radio, Select, Textarea, CardActions } from '@mui/joy';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary from '@mui/joy/AccordionSummary';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Alert2 from '../components/Alert2';
import { createAndUpdateAllDetail, createAndUpdateCompetition, createAndUpdateCompetitionList, getCompetition, removeAllDetail, removeCompetitionList } from '../store/features/competitionSlice';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';
import { convertToBuddhistYear, convertToGregorianYear } from '../components/Reuse';
import Swal from 'sweetalert2';

export default function CompetitionPage() {
  const [date] = useState(new Date());
  const currentYear = date.getFullYear() + 543;
  const { CompetitionList, Competitions, AllDetails } = useAppSelector((state) => state.competition);
  const { user } = useAppSelector((state) => state.user);
  // Group competitions by year
  const groupedCompetitions = CompetitionList && CompetitionList.reduce((acc, competition) => {
    const year = new Date(competition.dateTimeYear).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(competition);
    return acc;
  }, {} as Record<string, any[]>);

  // Sort years
  const sortedYears = Object.keys(groupedCompetitions).sort((a, b) => Number(b) - Number(a));

  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openSelectModal, setOpenSelectModal] = useState(false);
  const [openLinkModal, setOpenLinkModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const [competitionId, setCompetitionId] = useState<number | null>(0);
  const [name, setName] = useState("");
  const [selectedValue, setSelectedValue] = useState('a');
  const [dateTimeYear, setDateTimeYear] = useState<string>(new Date().toISOString().split('T')[0]);

  const [competitionListId, setCompetitionListId] = useState<number>(0);
  const [detailsCount, setDetailsCount] = useState('');
  const [details, setDetails] = useState<any[]>([]);

  const [idlinkDetail, setIdLinkDetail] = useState(0);
  const [linkDetail, setLinkDetail] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  }
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setCompetitionId(0);
    setName('');
  }

  const handleOpenDetailsModal = (item: []) => {
    setOpenDetailsModal(true);
    setDetails(item)
  }

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setDetails([])
  }

  const handleOpenSelectModal = (id?: number) => {
    setOpenSelectModal(true);
    if (id) {
      const competitionList = CompetitionList && CompetitionList.find(x => x.id === id);
      if (competitionList) {
        setCompetitionListId(competitionList.id);
        setCompetitionId(competitionList.competitionId);
        setDateTimeYear(competitionList.dateTimeYear);
        if (competitionList.details) {
          setDetails(competitionList.details);
          setDetailsCount(competitionList.details.length > 0 ? String(competitionList.details.length) : '');
        } else {
          setDetails([])
          setDetailsCount('')
        }
      }
    }
  }

  const handleCloseSelectModal = () => {
    setOpenSelectModal(false);
    setDetails([])
    setDetailsCount('')
    setCompetitionListId(0)
    setDateTimeYear(new Date().toISOString().split('T')[0])
    setCompetitionId(0);
  }

  const handleOpenLinkodal = (id?: number) => {
    setOpenLinkModal(true);
    if (id) {
      const allDetail = AllDetails && AllDetails.find(x => x.id === id);
      if (allDetail) {
        setIdLinkDetail(allDetail.id);
        setLinkDetail(allDetail.linkDetail);
      }
    }
  }

  const handleCloseLinkModal = () => {
    setOpenLinkModal(false);
    setIdLinkDetail(0);
    setLinkDetail("");
  }

  const handleCompetitionIdChange = (
    _event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    const competition = Competitions && Competitions.find(x => x.id === Number(newValue));
    if (competition) {
      setCompetitionId(newValue);
      setName(competition.name);
    }
    else {
      setCompetitionId(0);
      setName('');
    }
  };

  const alert = Alert2()
  const dispatch = useAppDispatch()

  const cAUCompetition = async () => {
    if (name.trim() === "") {
      alert.alertCustom(2, 'กรุณาป้อนข้อมูลให้ครบ');
      return;
    }
    const item = await dispatch(createAndUpdateCompetition({ competitionId, name }));
    if (item.payload !== "" && item.payload !== undefined) {
      alert.alertCustom(1, competitionId === 0 ? "สร้างรายการแข่งขันสำเร็จ" : "แก้ไขรายการแข่งขันสำเร็จ");

      setTimeout(async () => {
        await dispatch(getCompetition());
      }, 900);

      handleCloseAddModal();
    } else {
      alert.alertCustom(2, "เกิดข้อผิดพลาด!");
    }
  };

  const cAUCompetitionList = async () => {
    if (competitionId === 0) {
      alert.alertCustom(2, 'กรุณาป้อนข้อมูลให้ครบ');
      return;
    }
    const item = await dispatch(createAndUpdateCompetitionList({ competitionListId, dateTimeYear, competitionId, details }));
    if (item.payload !== "" && item.payload !== undefined) {
      alert.alertCustom(1, competitionListId === 0 ? "เลือกรายการแข่งขันสำเร็จ" : "แก้ไขเลือกรายการแข่งขันสำเร็จ");

      setTimeout(async () => {
        await dispatch(getCompetition());
      }, 900);

      handleCloseSelectModal();
    } else {
      alert.alertCustom(2, "เกิดข้อผิดพลาด!");
    }
  };

  const cAUAllDetail = async () => {
    const item = await dispatch(createAndUpdateAllDetail({ idlinkDetail, linkDetail }));
    if (item.payload !== "" && item.payload !== undefined) {
      alert.alertCustom(1, idlinkDetail === 0 ? "สร้างลิงค์เพิ่มสำเร็จ" : "แก้ไขลิงค์สำเร็จ");

      setTimeout(async () => {
        await dispatch(getCompetition());
      }, 900);

      handleCloseLinkModal();
    } else {
      alert.alertCustom(2, "เกิดข้อผิดพลาด!");
    }
  };
  const removeLinkDetail = async (id: number) => {
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
        const item = await dispatch(removeAllDetail(id));
        if (item.payload !== "" && item.payload !== undefined) {
          alert.alertCustom(1, "ลบเสร็จสิน");

          setTimeout(async () => {
            await dispatch(getCompetition());
          }, 900);
        } else {
          alert.alertCustom(2, "เกิดข้อผิดพลาด!");
        }
      }
    });
  };
  const removeCompetitionLists = async (id: number) => {
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
        const item = await dispatch(removeCompetitionList(id));
        if (item.payload !== "" && item.payload !== undefined) {
          alert.alertCustom(1, "ลบเสร็จสิน");

          setTimeout(async () => {
            await dispatch(getCompetition());
          }, 900);
        } else {
          alert.alertCustom(2, "เกิดข้อผิดพลาด!");
        }
      }
    });
  };
  const handleAddMembers = () => {
    const newDetailsCount = Number(detailsCount);
    if (newDetailsCount > details.length) {
      const newDetails = Array.from({ length: newDetailsCount - details.length }, (_) => ({
        name: '',
        text: ''
      }));
      setDetails([...details, ...newDetails]);
    } else if (newDetailsCount < details.length) {
      setDetails(details.slice(0, newDetailsCount));
    }
  };

  const handleMemberChange = (index: number, field: 'name' | 'text', value: string) => {
    const updatedDetails = [...details];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value
    };
    setDetails(updatedDetails);
  };
  return (
    <Container>
      <h1 style={{ textAlign: "center" }}>
        รายการแข่งขันงานสัปดาห์วิทยาศาสตร์
      </h1>
      {user && user?.role === "Admin" &&
        <Box display="flex" justifyContent="center" marginBottom={2}>
          <FormControl sx={{ maxWidth: 200, margin: 1 }}>
            <h4 style={{ textAlign: "center" }}>เพิ่ม/แก้ไขรายการ</h4>
            <IconButton onClick={handleOpenAddModal} variant="outlined">
              <AddCircleOutlineIcon color='success' />
              <div style={{ marginLeft: 5 }}></div>
              <EditIcon color='warning' />
            </IconButton>
          </FormControl>
          <FormControl sx={{ maxWidth: 200, margin: 1 }}>
            <h4 style={{ textAlign: "center" }}>เลือกรายการที่ต้องการเพิ่ม</h4>
            <IconButton onClick={() => handleOpenSelectModal()} variant="outlined">
              <AddTaskIcon color='success' />
            </IconButton>
          </FormControl>
        </Box>
      }

      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" marginBottom={2} flexWrap="wrap">
        <span style={{ textAlign: "center", flexBasis: '100%' }}>คลิกเพื่อดูระเบียบการประกวดผลงานและการแข่งขันทักษะทางวิทยาศาสตร์ทั้งหมด</span>
        {AllDetails && AllDetails.map((detail, index) => (
          <FormControl key={index} sx={{ maxWidth: 200, margin: 1, flexDirection: "row" }}>
            {user && user?.role === "Admin" &&
              <IconButton variant="outlined" sx={{ mr: 1 }} onClick={() => handleOpenLinkodal(detail.id)}>
                <EditIcon color='warning' />
              </IconButton>
            }
            <IconButton onClick={() => window.open(detail.linkDetail, '_blank')} variant="outlined">
              <LinkIcon color='secondary' />
            </IconButton>
            {user && user?.role === "Admin" &&
              <IconButton variant="outlined" sx={{ ml: 1 }} onClick={() => removeLinkDetail(detail.id)}>
                <CloseIcon color='error' />
              </IconButton>
            }
          </FormControl>
        ))}
        {user && user?.role === "Admin" &&
          <IconButton variant="outlined" onClick={() => handleOpenLinkodal()}>
            <AddCircleOutlineIcon color='success' />
          </IconButton>
        }
      </Box>

      <AccordionGroup>
        {sortedYears.map((year) => {
          const competitionCount = groupedCompetitions[year].length;
          const buddhistYear = parseInt(year) + 543; // แปลงปีจาก string เป็น number และเพิ่ม 543

          return (
            <Accordion key={year} defaultExpanded={buddhistYear.toString() === currentYear.toString()}>
              <AccordionSummary sx={{ backgroundColor: '#80e87c' }}>
                <h2 style={{ margin: 0 }}>
                  ปี {buddhistYear} ({competitionCount} รายการ) {/* ใช้ buddhistYear ที่เพิ่มแล้ว */}
                </h2>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: '#ddf5dc' }}>
                <Grid container spacing={2} sx={{ marginTop: 0.5 }}>
                  {groupedCompetitions[year].map((competition: any) => (
                    <Grid item xs={12} sm={6} md={4} key={competition.id}>
                      <Card variant="outlined">
                        <IconButton onClick={() => handleOpenDetailsModal(competition.details)} variant="outlined">
                          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                            <h4 style={{ margin: 0 }}>
                              {Competitions.find(x => x.id === competition.competitionId)?.name}
                            </h4>
                          </CardContent>
                        </IconButton>
                        {user && user?.role === "Admin" && (
                          <CardActions sx={{ justifyContent: 'center' }}>
                            <IconButton onClick={() => handleOpenSelectModal(competition.id)} variant="outlined">
                              <EditIcon color='warning' />
                            </IconButton>
                            <IconButton onClick={() => removeCompetitionLists(competition.id)} variant="outlined">
                              <CloseIcon color='error' />
                            </IconButton>
                          </CardActions>
                        )}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>

            </Accordion>
          );
        })}

      </AccordionGroup>

      <Modal open={openAddModal} onClose={handleCloseAddModal}>
        <ModalDialog sx={{ 
            width: { xs: '100%', sm: 600 }, // กว้าง 600 เมื่อหน้าจอขนาดกลางขึ้นไป
            maxWidth: '90%', // จำกัดความกว้างสูงสุดที่ 90% ของหน้าจอ
          }} >
          <ModalClose />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Radio
              checked={selectedValue === 'a'}
              onChange={handleChange}
              value="a"
              name="radio-buttons"
              slotProps={{ input: { 'aria-label': 'A' } }}
              label="สร้างรายการแข่งขัน"
            />
            <Radio
              checked={selectedValue === 'b'}
              onChange={handleChange}
              value="b"
              name="radio-buttons"
              slotProps={{ input: { 'aria-label': 'B' } }}
              label="แก้ไขรายการแข่งขัน"
            />
          </Box>
          {selectedValue === 'b' &&
            <Box>
              <h4>ต้องการแก้ไขรานการแข่งขันไหน</h4>
              <Select
                value={competitionId}
                onChange={handleCompetitionIdChange}
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
                {Competitions && Competitions.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.name}
                  </Option>
                ))
                }
              </Select>
            </Box>
          }
          <Box sx={{ overflow: 'auto', maxHeight: 600}}>
            <h4>ชื่อรายการ</h4>
            <Input name="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </Box>
          <Box sx={{ textAlign: "end" }}>
            <Button
              variant="solid"
              color="primary"
              sx={{ mt: 2 }}
              onClick={cAUCompetition}
            >
              ยืนยัน
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      <Modal open={openSelectModal} onClose={handleCloseSelectModal}>
        <ModalDialog sx={{ 
            width: { xs: '100%', sm: 600 }, // กว้าง 600 เมื่อหน้าจอขนาดกลางขึ้นไป
            maxWidth: '90%', // จำกัดความกว้างสูงสุดที่ 90% ของหน้าจอ
          }}>
          <ModalClose />
          <Box sx={{ overflow: 'auto', maxHeight: 600 }}>
            <Box>
              <h4>เลือกรายการแข่งขัน</h4>
              <Select
                value={competitionId}
                onChange={handleCompetitionIdChange}
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
                {Competitions && Competitions.map(c => (
                  <Option key={c.id} value={c.id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </Box>
            <Box>
              <h4 style={{ marginTop: 5 }}>ปี</h4>
              <Input type="date" name="startDate" required value={convertToBuddhistYear(dateTimeYear)} onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setDateTimeYear('');
                  return;
                }
                const newYear = convertToGregorianYear(e.target.value)
                setDateTimeYear(newYear)
              }} />
            </Box>
            <Box>
              <h4>
                จำนวนหัวข้อ
              </h4>
              <Input name="membersCount" type='number' required value={detailsCount} onChange={(e) => setDetailsCount(e.target.value)} />

              <Button variant="solid" sx={{ mt: 1 }} disabled={detailsCount ? false : true} onClick={handleAddMembers}>
                สร้างช่องกรอกข้อมูล
              </Button>

              {details.map((item, index) => (
                <Box key={index} sx={{ mt: 2 }}>
                  <h4>{`หัวข้อที่ ${index + 1}`}</h4>
                  <Input name="name" required value={item.name} onChange={(e) => handleMemberChange(index, 'name', e.target.value)} />

                  <h4>{`ข้อความสำหรับหัวข้อที่ ${index + 1}`}</h4>
                  <Textarea name="text" required value={item.text} minRows={2} maxRows={5} onChange={(e) => handleMemberChange(index, 'text', e.target.value)} style={{ whiteSpace: 'pre-wrap' }}/>
                </Box>
              ))}

              <Box sx={{ textAlign: "end" }}>
                <Button
                  variant="solid"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={cAUCompetitionList}
                >
                  ยืนยัน
                </Button>
              </Box>
            </Box>
          </Box>
        </ModalDialog>
      </Modal>

      <Modal open={openLinkModal} onClose={handleCloseLinkModal}>
        <ModalDialog sx={{ 
            width: { xs: '100%', sm: 600 }, // กว้าง 600 เมื่อหน้าจอขนาดกลางขึ้นไป
            maxWidth: '90%', // จำกัดความกว้างสูงสุดที่ 90% ของหน้าจอ
          }}>
          <ModalClose />
          <Box sx={{ overflow: 'auto', maxHeight: 600 }}>
            <h4>ลิงค์</h4>
            <Input name="linkDetail" required value={linkDetail} onChange={(e) => setLinkDetail(e.target.value)} />
          </Box>
          <Box sx={{ textAlign: "end" }}>
            <Button
              variant="solid"
              color="primary"
              sx={{ mt: 2 }}
              onClick={cAUAllDetail}
            >
              ยืนยัน
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      <Modal open={openDetailsModal} onClose={handleCloseDetailsModal}>
        <ModalDialog sx={{ 
            width: { xs: '100%', sm: 600 }, // กว้าง 600 เมื่อหน้าจอขนาดกลางขึ้นไป
            maxWidth: '90%', // จำกัดความกว้างสูงสุดที่ 90% ของหน้าจอ
          }}>
          <ModalClose />
          <Box sx={{ overflow: 'auto', maxHeight: 600 }}>
            {details && details.map((x, index) => (
              <Box
                key={index}
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: 2,
                  marginBottom: 2,
                  backgroundColor: '#f9f9f9'
                }}
              >
                <h3 style={{ margin: 0 }}>{index + 1}. {x.name}</h3>
                {x.text.split('\n').map((line:string, lineIndex:number) => (
                  <p key={lineIndex} style={{ margin: 0 }}>{line}</p>
                ))}
              </Box>
            ))}
          </Box>
        </ModalDialog>
      </Modal>
    </Container>
  );
}
