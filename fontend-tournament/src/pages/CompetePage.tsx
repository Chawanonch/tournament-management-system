import { Container, Box, FormControl, Input, Button, Select, IconButton, Card, CardContent, Modal, ModalDialog, ModalClose, Chip, Option } from '@mui/joy';
import { Grid, Pagination } from '@mui/material';
import React, { useState } from 'react'
import Swal from 'sweetalert2';
import Alert2 from '../components/Alert2';
import NavigateCustom from '../components/NavigateCustom';
import { formatDate, convertToBuddhistYear, convertToGregorianYear } from '../components/Reuse';
import { createAndUpdateRegistrationCompete, getRegistration } from '../store/features/registrationSlice';
import { getTeams } from '../store/features/teamSlice';
import { createAndUpdateCompete, createAndUpdateCompetes, getCompete, removeCompete, statusHideCompete, statusHideCompetes } from '../store/features/competeSlice';
import { useAppSelector, useAppDispatch } from '../store/store';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import InfoIcon from '@mui/icons-material/Info';

export default function CompetePage() {
  const { Competes } = useAppSelector((state) => state.compete);
  const { Competitions, CompetitionList } = useAppSelector((state) => state.competition);
  const { registrationCompetes } = useAppSelector((state) => state.registration);
  const { levels } = useAppSelector((state) => state.level);
  const { teamByUser } = useAppSelector((state) => state.team);
  const [selectLevel, setSelectLevel] = useState<number | null>(0);
  const [selectCom, setSelectCom] = useState<number | null>(0);
  const [selectTeam, setSelectTeam] = useState<number | null>(0);
  const [searchName, setSearchName] = useState<string>("");
  const [addTeam, setAddTeam] = useState<string>("");
  const { user, token } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch()
  const alert = Alert2()
  const [date] = useState(new Date());
  const currentYear = date.getFullYear() + 543;
  const maxYear = currentYear + 1;
  const years = [];

  for (let i = maxYear; i >= currentYear - 20; i--) {
    years.push(i);
  }

  const [openAddAndUpdateModal, setOpenAddAndUpdateModal] = useState(false);
  const [name, setName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>("");
  const [listLevels, setListLevels] = useState<any[]>([]);

  const [id, setId] = useState<number>(0);
  const [competitionListId, setCompetitionListId] = useState<number | null>(0);

  const [openHideOrNotHideModal, setOpenHideOrNotHideModal] = useState(false);
  const [year, setYear] = useState<number>(0);

  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [details, setDetails] = useState<any[]>([]);
  const navigate = NavigateCustom()

  const handleChange = (
    _event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setSelectLevel(newValue)
  };
  const handleComChange = (
    _event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setSelectCom(newValue)
  };
  const handleTeamChange = (
    _event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setSelectTeam(newValue)
  };
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsCompetePage = 2;

  const filterResult = Competes && Competes.filter(x =>
    (selectLevel === 0 || x.listLevelCompetes.some(level => level.levelId === selectLevel)) &&
    (searchName === "" || x.name.toLowerCase().includes(searchName.toLowerCase())) &&
    (selectCom === 0 || x.competitionListId === CompetitionList.find(c => c.competitionId === selectCom)?.id) &&
    (user && user.role === "Admin" || x.isHide === false)
  );

  const paginatedCompete = filterResult && filterResult.slice((currentPage - 1) * itemsCompetePage, currentPage * itemsCompetePage);
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(value);
  };
  const [openAddModals, setOpenAddModals] = useState(false);

  const [nameAndLevelsCount, setNameAndLevelsCount] = useState('');
  const [nameAndLevels, setNameAndLevels] = useState<any[]>([]);

  const handleAddNameAndLevels = () => {
    const newNameAndLevelsCount = Number(nameAndLevelsCount);
    if (newNameAndLevelsCount > nameAndLevels.length) {
      const newNameAndLevels = Array.from({ length: newNameAndLevelsCount - nameAndLevels.length }, (_,index:number) => ({
        id: index,
        name: '',
        listLevel: []
      }));
      setNameAndLevels([...nameAndLevels, ...newNameAndLevels]);
    } else if (newNameAndLevelsCount < nameAndLevels.length) {
      setNameAndLevels(nameAndLevels.slice(0, newNameAndLevelsCount));
    }
  };

  const handleNameAndLevelChange = (index: number, field: 'name' | 'listLevel', value: any) => {
    const updatedNameAndLevels = [...nameAndLevels];
    updatedNameAndLevels[index] = {
      ...updatedNameAndLevels[index],
      [field]: value
    };
    setNameAndLevels(updatedNameAndLevels);
  };

  const handleOpenModal = (id?: number) => {
    setOpenAddAndUpdateModal(true);
    if (id) {
      const t = Competes && Competes.find(x => x.id === Number(id));

      if (t) {
        setId(id)
        setName(t.name)
        setStartDate(t.startDate.toString().split('T')[0])
        setEndDate(t.endDate.toString().split('T')[0])
        if (listLevels) setListLevels(t.listLevelCompetes.map(x => x.levelId))
        else setListLevels([])
        setCompetitionListId(t.competitionListId)
      } else {
        setOpenAddAndUpdateModal(false);
        setId(0)
        setName("")
        setStartDate("")
        setEndDate("")
        setListLevels([])
        setCompetitionListId(0)
      }
    }
  };

  const handleCloseModal = () => {
    setOpenAddAndUpdateModal(false);
    setId(0)
    setName("")
    setStartDate("")
    setEndDate("")
    setListLevels([])
    setCompetitionListId(0)
  };
  const handleOpenModals = () => {
    setOpenAddModals(true);
  };

  const handleCloseModals = () => {
    setOpenAddModals(false);
    setId(0)
    setName("")
    setEndDate("")
    setListLevels([])
    setCompetitionListId(0)
    setNameAndLevelsCount('')
    setNameAndLevels([])
  };
  const handleOpenDetailsModal = (id: number) => {
    const detail = CompetitionList && CompetitionList.find(c => c.id === id);
    if (detail) {
      setOpenDetailsModal(true);
      setDetails(detail.details)
    }
  }

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setDetails([])
  }
  const handleOpenHideOrNotHideModal = () => {
    setOpenHideOrNotHideModal(true);
  };

  const handleCloseHideOrNotHideModal = () => {
    setOpenHideOrNotHideModal(false);
    setYear(0)
  };
  const hideCompeteByYear = async () => {
    if (year === 0) {
      alert.alertCustom(2, 'กรุณาป้อนข้อมูลให้ครบ');
      return;
    }
    const item = await dispatch(statusHideCompetes(year));
    if (item.payload !== "" && item.payload !== undefined) {
      alert.alertCustom(1, "ซ่อน/ยกเลิกซ่อน รายการแข่งขันสำเร็จ");

      setTimeout(async () => {
        await dispatch(getCompete());
      }, 900);

      handleCloseHideOrNotHideModal();
    } else {
      alert.alertCustom(2, "ไม่มีรายการที่จะซ่อน");
    }
  };
  const regisCompete = async (CompeteId: number) => {
    const checkRole = user && user?.role === "Admin";
    const teamId = selectTeam;
    const teamName = addTeam;

    if (checkRole) {
      if (teamName === "") {
        alert.alertCustom(3, "กรุณาใส่ชื่อทีม!");
        return;
      }
    } else {
      if (teamId === 0) {
        alert.alertCustom(3, "กรุณาเลือกทีม!");
        return;
      }
    }

    if (!checkRole) {
      const registration = registrationCompetes && registrationCompetes.find(r => r.competeId === CompeteId && r.teamId === teamId);

      if (registration !== undefined && registration !== null) {
        alert.alertCustom(3, "ทีมมีการลงทะเบียนแล้ว!");
        return;
      }
    }
    const Compete = Competes && Competes.find(t => t.id === CompeteId);

    const currentDateInBuddhistEra = new Date();
    currentDateInBuddhistEra.setFullYear(currentDateInBuddhistEra.getFullYear());

    if (Compete && currentDateInBuddhistEra <= new Date(Compete.endDate)) {
      const registrationData = checkRole ? { CompeteId, teamName } : { CompeteId, teamId };

      const item = await dispatch(createAndUpdateRegistrationCompete(registrationData));
      if (item.payload !== "" && item.payload !== undefined) {
        alert.alertCustom(1, "ลงทะเบียนทีมสำเร็จ!");

        setTimeout(async () => {
          await dispatch(getTeams());
          await dispatch(getRegistration());
          setAddTeam("")
          setSelectTeam(0)
        }, 900);

      } else {
        alert.alertCustom(2, "เกิดข้อผิดพลาด!");
      }
    } else {
      alert.alertCustom(2, "ไม่สามารถลงทะเบียนได้ เนื่องจากการแข่งขันสิ้นสุดแล้ว!");
    }
  }

  const cAUCompete = async () => {
    if (name.trim() === "" || startDate.trim() === "" || endDate.trim() === "" || listLevels.length === 0) {
      alert.alertCustom(2, 'กรุณาป้อนข้อมูลให้ครบ');
      return;
    }
    const item = await dispatch(createAndUpdateCompete({ id, name, startDate, endDate, competitionListId, listLevels }));
    if (item.payload !== "" && item.payload !== undefined) {
      alert.alertCustom(1, id === 0 ? "สร้างรายการแข่งขันสำเร็จ" : "แก้ไขรายการแข่งขันสำเร็จ");

      setTimeout(async () => {
        await dispatch(getCompete());
      }, 900);

      handleCloseModal();
    } else {
      alert.alertCustom(2, "เกิดข้อผิดพลาด!");
    }
  };
  const cAUCompetes = async () => {
    if (startDate.trim() === "" || endDate.trim() === "") {
      alert.alertCustom(2, 'กรุณาป้อนข้อมูลให้ครบ');
      return;
    }
    const item = await dispatch(createAndUpdateCompetes({ id, nameAndLevels, startDate, endDate, competitionListId }));
    if (item.payload !== "" && item.payload !== undefined) {
      alert.alertCustom(1, id === 0 ? "สร้างรายการแข่งขันสำเร็จ" : "แก้ไขรายการแข่งขันสำเร็จ");

      setTimeout(async () => {
        await dispatch(getCompete());
      }, 900);

      handleCloseModals();
    } else {
      alert.alertCustom(2, "เกิดข้อผิดพลาด!");
    }
  };
  const removeCompeteById = async (id: number) => {
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
        const item = await dispatch(removeCompete(id));
        if (item.payload !== "" && item.payload !== undefined) {
          Swal.fire({
            title: "ลบสำเร็จ!",
            icon: "success"
          });

          setTimeout(async () => {
            await dispatch(getCompete());
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

  const hideCompeteById = async (id: number) => {
    const t = Competes && Competes.find(x => x.id === Number(id));

    Swal.fire({
      title: t && t.isHide === false ? "คุณต้องการซ่อนใช่ไหม" : "คุณต้องการยกเลิกซ่อนใช่ไหม",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่ ฉันต้องการซ่อน",
      cancelButtonText: "ยกเลิก"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const item = await dispatch(statusHideCompete(id));
        if (item.payload !== "" && item.payload !== undefined) {
          Swal.fire({
            title: item.payload.isHide === false ? "ยกเลิกซ่อนสำเร็จ" : "ซ่อนสำเร็จ",
            icon: "success"
          });

          setTimeout(async () => {
            await dispatch(getCompete());
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

  const handleLevelsChange = (
    _event: React.SyntheticEvent | null,
    newValue: number | number[] | null,
  ) => {
    setListLevels(newValue as number[]);
  };

  const handleCompetitionListIdChange = (
    _event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    const competition = CompetitionList && CompetitionList.find(x => x.id === Number(newValue));
    if (competition) {
      setCompetitionListId(newValue);
    }
    else {
      setCompetitionListId(0);
    }
  };
  const handleYearChange = (_: any, newValue: any) => {
    setYear(newValue);
  };
  return (
    <Container>
      <Box
        sx={{
          width: '100%',
          position: 'relative',
          overflow: { xs: 'auto', sm: 'initial' },
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={7}>
            <FormControl >
              <h4>ค้นหาชื่อรายการแข่งขัน</h4>
              <Input
                placeholder="ค้นหา..."
                startDecorator={
                  <Button sx={{ width: 35 }} variant="soft" color="neutral" disabled startDecorator={<SearchIcon />}>
                  </Button>
                }
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                sx={{ borderRadius: 8 }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2.5}>
            <FormControl >
              <h4>ระดับของรายการแข่งขัน</h4>
              <Select defaultValue={0} onChange={handleChange}>
                <Option value={0}>ทั้งหมด</Option>
                {levels.map((level) => (
                  <Option key={level.id} value={level.id}>
                    {level.name}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2.5}>
            <FormControl>
              <h4>หมวดการแข่งขัน</h4>
              <Select defaultValue={0} onChange={handleComChange}>
                <Option value={0}>ทั้งหมด</Option>
                {Competitions && Competitions.map((c) => {
                  return (
                    <Option key={c.id} value={c.id}>
                      {c ? c.name : 'ไม่มีข้อมูล'}
                    </Option>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          {user && user?.role === "Admin" && (
            <Grid item xs={12} md={2.5}>
              <FormControl >
                <h4 style={{ textAlign: "center" }}>สร้างหลายรายการแข่งขัน</h4>
                <IconButton onClick={handleOpenModals}>
                  <AddCircleOutlineIcon color='success' />
                </IconButton>
              </FormControl>
            </Grid>
          )}

          {user && user?.role === "Admin" && (
            <Grid item xs={12} md={2.5}>
              <FormControl >
                <h4 style={{ textAlign: "center" }}>สร้างรายการแข่งขัน</h4>
                <IconButton onClick={() => handleOpenModal()}>
                  <AddCircleOutlineIcon color='success' />
                </IconButton>
              </FormControl>
            </Grid>
          )}

          {user && user?.role === "Admin" && (
            <Grid item xs={12} md={2.5}>
              <FormControl >
                <h4 style={{ textAlign: "center" }}>ซ่อน/ยกเลิกซ่อนการแข่งขันตามปี</h4>
                <IconButton onClick={() => handleOpenHideOrNotHideModal()}>
                  <VisibilityIcon color='success' />
                  <div style={{ marginLeft: 5 }}></div>
                  <VisibilityOffIcon color='warning' />
                </IconButton>
              </FormControl>
            </Grid>
          )}
        </Grid>
        <div style={{ marginTop: 10 }}></div>
        {paginatedCompete && paginatedCompete.length > 0 && paginatedCompete.map((Compete: any) => {
          const selectedCompetitionList = CompetitionList && CompetitionList.find(x => x.id === Compete.competitionListId);
          const selectedCompetition = selectedCompetitionList && Competitions && Competitions.find(c => c.id === selectedCompetitionList.competitionId);
          return (
            <Card
              key={Compete.id} // แนะนำให้มี id สำหรับแต่ละรายการแข่งขัน
              orientation="horizontal"
              sx={{
                mb: 2, // เพิ่ม margin ด้านล่างเพื่อแยกแต่ละการ์ด
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <h3>หมวดการแข่งขัน: </h3>
                      <p>{selectedCompetition ? selectedCompetition.name : 'ไม่มีข้อมูล'}</p>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <IconButton onClick={() => handleOpenDetailsModal(Compete.competitionListId)}>
                        <InfoIcon color='primary' />
                      </IconButton>

                      {user && user.role === "Admin" && (
                        <>
                          <IconButton onClick={() => handleOpenModal(Compete.id)}>
                            <EditIcon color='warning' />
                          </IconButton>

                          <IconButton onClick={() => hideCompeteById(Compete.id)}>
                            {Compete.isHide ?
                              <VisibilityOffIcon color='inherit' /> :
                              <VisibilityIcon color='inherit' />}
                          </IconButton>

                          <IconButton onClick={() => removeCompeteById(Compete.id)}>
                            <RemoveCircleOutlineIcon color='error' />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <h3>ชื่อรายการแข่งขัน: </h3>
                  <p>{Compete.name}</p>
                </Box>
                <h4>ระดับของรายการแข่งขัน:</h4>
                <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                  {Compete.listLevelCompetes && Compete.listLevelCompetes.map((level: any, index: number) => (
                    <span key={level.id}>
                      {levels && levels.find(x => x.id === level.levelId)?.name}
                      {index < Compete.listLevelCompetes.length - 1 ? ' , ' : ''}
                    </span>
                  ))}
                </Box>
                <Grid container spacing={2} sx={{ my: 1.5 }}>
                  <Grid item xs={6} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: 2 }}>
                    <h4>เวลาที่เริ่มการแข่ง:</h4>
                    <p>{formatDate(Compete.startDate)}</p>
                  </Grid>
                  <Grid item xs={6} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: 2 }}>
                    <h4>เวลาที่สิ้นสุดการแข่ง:</h4>
                    <p>{formatDate(Compete.endDate)}</p>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' }, '& > button': { flex: 1 } }}>
                  {token !== "" ? (
                    user?.role === "Admin" ? (
                      <>
                        <Input
                          placeholder="ชื่อโรงเรียน..."
                          startDecorator={
                            <Button sx={{ width: 35 }} variant="soft" color="neutral" disabled startDecorator={<SupervisedUserCircleIcon />} />
                          }
                          value={addTeam}
                          onChange={(e) => setAddTeam(e.target.value)}
                          sx={{ borderRadius: 8 }}
                        />
                        <Button variant="outlined" color="neutral" onClick={() => regisCompete(Compete.id)}>
                          <h4>ลงทะเบียนด่วน (กรอกชื่อโรงเรียน)</h4>
                        </Button>
                      </>
                    ) : (
                      <>
                        {teamByUser.length > 0 ? (
                          <Select
                            defaultValue={selectTeam}
                            onChange={handleTeamChange}
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
                            <Option value={0}>ทีมของฉัน</Option>
                            {teamByUser && teamByUser.filter((item: any) =>
                              Compete.listLevelCompetes && Compete.listLevelCompetes.some((l: any) => l.levelId === item.levelId)
                            ).map((team: any) => {
                              const isRegistered = registrationCompetes && registrationCompetes.some(
                                (reg: any) => reg.CompeteId === Compete.id && reg.teamId === team.id
                              );
                              return (
                                <Option key={team.id} value={team.id} disabled={isRegistered}>
                                  {team.schoolName} {isRegistered ? "(ทีมนี้ลงทะเบียนไปแล้ว)" : ""}
                                </Option>
                              );
                            })}
                          </Select>
                        ) : (
                          <h4>ไม่มีทีม</h4>
                        )}
                        <Button variant="solid" color="primary" onClick={() => regisCompete(Compete.id)}>
                          <h4>ลงทะเบียนทีม</h4>
                        </Button>
                      </>
                    )
                  ) : null}

                  <Button variant="solid" color="primary" onClick={() => navigate.navigateToCompeteDetail(Compete.id)}>
                    <h4>รายละเอียดการแข่งขัน</h4>
                  </Button>
                </Box>
              </CardContent>

            </Card>
          )
        })}
        {filterResult && filterResult.length > 0 &&
          <Pagination
            count={Math.ceil(filterResult.length / itemsCompetePage)}
            page={currentPage}
            onChange={handlePageChange}
            sx={{ marginTop: 2, alignItems: "center" }}
          />
        }
      </Box>

      <Modal open={openAddAndUpdateModal} onClose={handleCloseModal}>
        <ModalDialog sx={{
          width: { xs: '100%', sm: 600 }, // กว้าง 600 เมื่อหน้าจอขนาดกลางขึ้นไป
          maxWidth: '90%', // จำกัดความกว้างสูงสุดที่ 90% ของหน้าจอ
        }}>
          <ModalClose />
          <Box sx={{ overflow: 'auto', maxHeight: 600 }}>
            <Box>
              <Box>
                <h4>เลือกรายการแข่งขัน</h4>
                <Select
                  value={competitionListId}
                  onChange={handleCompetitionListIdChange}
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
                  {CompetitionList && CompetitionList.map(c => (
                    <Option key={c.id} value={c.id}>
                      [{new Date(c.dateTimeYear).getFullYear() + 543}] {Competitions.find((x: any) => x.id === c.competitionId)?.name}
                    </Option>
                  ))}
                </Select>
              </Box>
              <h3></h3>
              <h4>ชื่อรายการแข่งขัน</h4>
              <Input name="name" fullWidth required value={name} onChange={(e) => setName(e.target.value)} />

              <h4 style={{ marginTop: 5 }}>ระดับรายการแข่งขัน</h4>
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

                onChange={handleLevelsChange}
                value={listLevels}
              >
                {levels && levels.map((l) => (
                  <Option key={l.id} value={l.id}>
                    {l.name}
                  </Option>
                ))}
              </Select>
              <h4 style={{ marginTop: 5 }}>เวลาเริ่มการแข่งขัน</h4>
              <Input type="date" slotProps={{
                input: {
                  min: convertToBuddhistYear(new Date().toISOString().split('T')[0]),
                },
              }} name="startDate" required value={convertToBuddhistYear(startDate)} onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setStartDate('');
                  return;
                }
                const newYear = convertToGregorianYear(e.target.value)
                setStartDate(newYear)
              }} />
              <h4 style={{ marginTop: 5 }}>เวลาสิ้นสุดการแข่งขัน</h4>
              <Input type="date" slotProps={{
                input: {
                  min: startDate ? convertToBuddhistYear(new Date(new Date(startDate).getTime() + 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split('T')[0])
                    : convertToBuddhistYear(new Date().toISOString().split('T')[0]),
                },
              }} name="endDate" required disabled={!startDate} value={convertToBuddhistYear(endDate)} onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setEndDate('');
                  return;
                }
                const newYear = convertToGregorianYear(e.target.value)

                setEndDate(newYear)
              }} />
            </Box>
            <Box sx={{ textAlign: "end" }}>
              <Button
                variant="solid"
                color="primary"
                sx={{ mt: 2 }}
                onClick={cAUCompete}
              >
                ยืนยัน
              </Button>
            </Box>
          </Box>
        </ModalDialog>
      </Modal>
      <Modal open={openAddModals} onClose={handleCloseModals}>
        <ModalDialog sx={{
          width: { xs: '100%', sm: 600 }, // กว้าง 600 เมื่อหน้าจอขนาดกลางขึ้นไป
          maxWidth: '90%', // จำกัดความกว้างสูงสุดที่ 90% ของหน้าจอ
        }}>
          <ModalClose />
          <Box sx={{ overflow: 'auto', maxHeight: 600 }}>
            <Box>
            <h4>เลือกรายการแข่งขัน</h4>
            <Select
              value={competitionListId}
              onChange={handleCompetitionListIdChange}
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
              {CompetitionList && CompetitionList.map(c => (
                <Option key={c.id} value={c.id}>
                  [{new Date(c.dateTimeYear).getFullYear() + 543}] {Competitions.find((x: any) => x.id === c.competitionId)?.name}
                </Option>
              ))}
            </Select>
              <h4 style={{ marginTop: 5 }}>เวลาเริ่มการแข่งขัน</h4>
              <Input type="date" slotProps={{
                input: {
                  min: convertToBuddhistYear(new Date().toISOString().split('T')[0]),
                },
              }} name="startDate" required value={convertToBuddhistYear(startDate)} onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setStartDate('');
                  return;
                }
                const newYear = convertToGregorianYear(e.target.value)
                setStartDate(newYear)
              }} />
              <h4 style={{ marginTop: 5 }}>เวลาสิ้นสุดการแข่งขัน</h4>
              <Input type="date" slotProps={{
                input: {
                  min: startDate ? convertToBuddhistYear(new Date(new Date(startDate).getTime() + 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split('T')[0])
                    : convertToBuddhistYear(new Date().toISOString().split('T')[0]),
                },
              }} name="endDate" required disabled={!startDate} value={convertToBuddhistYear(endDate)} onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setEndDate('');
                  return;
                }
                const newYear = convertToGregorianYear(e.target.value)

                setEndDate(newYear)
              }} />
            </Box>

            <Box>
              <h4>
                จำนวนที่ต้องการสร้าง
              </h4>
              <Input name="nameAndLevelsCount" type='number' required value={nameAndLevelsCount} onChange={(e) => setNameAndLevelsCount(e.target.value)} />

              <Button variant="solid" sx={{ mt: 1 }} disabled={nameAndLevelsCount ? false : true} onClick={handleAddNameAndLevels}>
                สร้างช่องกรอกข้อมูล
              </Button>

              {nameAndLevels.map((item, index) => (
                <Box key={index} sx={{ mt: 2 }}>
                  <h4>{`ชื่อที่ ${index + 1}`}</h4>
                  <Input name="name" required value={item.name} onChange={(e) => handleNameAndLevelChange(index, 'name', e.target.value)} />

                  <h4>{`ระดับของอันที่ ${index + 1}`}</h4>
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
                    value={item.listLevel}  // ใช้ item.listLevel แทน listLevels ถ้าเป็นค่าที่ต้องการ
                    onChange={(_, newValue: number | number[] | null) => handleNameAndLevelChange(index, 'listLevel', newValue)}
                  >
                    {levels && levels.map((l) => (
                      <Option key={l.id} value={l.id}>
                        {l.name}
                      </Option>
                    ))}
                  </Select>

                </Box>
              ))}

              <Box sx={{ textAlign: "end" }}>
                <Button
                  variant="solid"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={cAUCompetes}
                >
                  ยืนยัน
                </Button>
              </Box>
            </Box>
          </Box>
        </ModalDialog>
      </Modal>
      <Modal open={openHideOrNotHideModal} onClose={handleCloseHideOrNotHideModal}>
        <ModalDialog sx={{
          width: { xs: '100%', sm: 600 }, // กว้าง 600 เมื่อหน้าจอขนาดกลางขึ้นไป
          maxWidth: '90%', // จำกัดความกว้างสูงสุดที่ 90% ของหน้าจอ
        }}>
          <ModalClose />
          <Box sx={{ overflow: 'auto', maxHeight: 600 }}>
            <Box>
              <h4>ปีที่จะซ่อน/ยกเลิกซ่อน</h4>
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
            </Box>
            <Box sx={{ textAlign: "end" }}>
              <Button
                variant="solid"
                color="primary"
                sx={{ mt: 2 }}
                onClick={hideCompeteByYear}
              >
                ยืนยัน
              </Button>
            </Box>
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
                {x.text.split('\n').map((line: string, lineIndex: number) => (
                  <p key={lineIndex} style={{ margin: 0 }}>{line}</p>
                ))}
              </Box>
            ))}
          </Box>
        </ModalDialog>
      </Modal>
    </Container>
  )
}
