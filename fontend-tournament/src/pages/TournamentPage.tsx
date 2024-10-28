import { Container, Box, Card, AspectRatio, CardContent, Button, FormControl, Select, Option, Input, IconButton, Modal, ModalClose, ModalDialog, Chip } from '@mui/joy';
import { useAppDispatch, useAppSelector } from '../store/store';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Grid, Pagination } from '@mui/material';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import { createAndUpdateRegistration, getRegistration } from '../store/features/registrationSlice';
import Alert2 from '../components/Alert2';
import { convertToBuddhistYear, convertToGregorianYear, formatDate, formatNumberWithCommas, windowSizes } from '../components/Reuse';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { createAndUpdateTournament, getTournament, removeTournament, statusHideTournament, statusHideTournaments } from '../store/features/tournamentSlice';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { getMatch, resetTeamsAndDeleteMatches } from '../store/features/matchSlice';
import NavigateCustom from '../components/NavigateCustom';
import { getTeams } from '../store/features/teamSlice';
import { useDropzone } from 'react-dropzone';
import { folderImage } from '../components/api/agent';

export default function TournamentPage() {
  const { tournaments } = useAppSelector((state) => state.tournament);
  const { registrations } = useAppSelector((state) => state.registration);
  const { levels } = useAppSelector((state) => state.level);
  const { teamByUser } = useAppSelector((state) => state.team);
  const { matchs } = useAppSelector((state) => state.match);
  const [selectLevel, setSelectLevel] = useState<number | null>(0);
  const [selectTeam, setSelectTeam] = useState<number | null>(0);
  const [searchName, setSearchName] = useState<string>("");
  const [addTeam, setAddTeam] = useState<string>("");
  const { user, token } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch()
  const alert = Alert2()
  const [openAddAndUpdateModal, setOpenAddAndUpdateModal] = useState(false);
  const [name, setName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>("");
  const [listLevels, setListLevels] = useState<any[]>([]);
  const [prizesCount, setPrizesCount] = useState('');
  const [prizes, setPrizes] = useState<any[]>([]);
  const [image, setImage] = useState<string | File>("");
  const [id, setId] = useState<number>(0);
  const navigate = NavigateCustom()
  const windowSize = windowSizes();

  const [openHideOrNotHideModal, setOpenHideOrNotHideModal] = useState(false);
  const [year, setYear] = useState<number>(0);
  const [ date ] = useState(new Date());
  const currentYear = date.getFullYear() + 543;
  const maxYear = currentYear + 1;
  const years = [];

  for (let i = maxYear; i >= currentYear - 20; i--) {
    years.push(i);
  }
  const handleChange = (
    _event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setSelectLevel(newValue)
  };
  const handleTeamChange = (
    _event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setSelectTeam(newValue)
  };
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsTournamentPage = 2;

  const filterResult = tournaments && tournaments.filter(x =>
    (selectLevel === 0 || x.listLevels.some(level => level.levelId === selectLevel)) &&
    (searchName === "" || x.name.toLowerCase().includes(searchName.toLowerCase())) &&
    (user && user.role === "Admin" || x.isHide === false)
  );

  const paginatedTournament = filterResult && filterResult.slice((currentPage - 1) * itemsTournamentPage, currentPage * itemsTournamentPage);
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(value);
  };

  const handleOpenModal = (id?: number) => {
    setOpenAddAndUpdateModal(true);
    if (id) {
      const t = tournaments && tournaments.find(x => x.id === Number(id));

      if (t) {
        setId(id)
        setName(t.name)
        setStartDate(t.startDate.toString().split('T')[0])
        setEndDate(t.endDate.toString().split('T')[0])
        if (listLevels) setListLevels(t.listLevels.map(x => x.levelId))
        else setListLevels([])
        setPrizesCount(t.prizes.length > 0 ? String(t.prizes.length) : '');
        setPrizes(t.prizes);
        setImage(t.gameImageUrl)
      } else {
        setOpenAddAndUpdateModal(false);
        setId(0)
        setName("")
        setStartDate("")
        setEndDate("")
        setListLevels([])
        setImage("")
        setPrizes([]);
        setPrizesCount('')
        setImage("")
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
    setImage("")
    setPrizes([]);
    setPrizesCount('')
  };
  const handleOpenHideOrNotHideModal = () => {
    setOpenHideOrNotHideModal(true);
  };

  const handleCloseHideOrNotHideModal = () => {
    setOpenHideOrNotHideModal(false);
    setYear(0)
  };
  const hideTournamentByYear = async () => {
    if (year === 0) {
      alert.alertCustom(2, 'กรุณาป้อนข้อมูลให้ครบ');
      return;
    }
    const item = await dispatch(statusHideTournaments(year));
    if (item.payload !== "" && item.payload !== undefined) {
      alert.alertCustom(1,"ซ่อน/ยกเลิกซ่อน รายการแข่งขันสำเร็จ");

      setTimeout(async () => {
        await dispatch(getTournament());
      }, 900);

      handleCloseHideOrNotHideModal();
    } else {
      alert.alertCustom(2, "ไม่มีรายการที่จะซ่อน");
    }
  };
  const regisTournament = async (tournamentId: number) => {
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
      const registration = registrations && registrations.find(r => r.tournamentId === tournamentId && r.teamId === teamId);

      if (registration !== undefined && registration !== null) {
        alert.alertCustom(3, "ทีมมีการลงทะเบียนแล้ว!");
        return;
      }
    }
    const tournament = tournaments && tournaments.find(t => t.id === tournamentId);

    const currentDateInBuddhistEra = new Date();
    currentDateInBuddhistEra.setFullYear(currentDateInBuddhistEra.getFullYear());

    if (tournament && currentDateInBuddhistEra <= new Date(tournament.endDate)) {
      const registrationData = checkRole ? { tournamentId, teamName } : { tournamentId, teamId };

      const item = await dispatch(createAndUpdateRegistration(registrationData));
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
  const handleAddPrizes = () => {
    const newPrizesCount = Number(prizesCount);
    if (newPrizesCount > prizes.length) {
      const newPrizes = Array.from({ length: newPrizesCount - prizes.length }, (_) => ({
        price: '',
        rank: ''
      }));
      setPrizes([...prizes, ...newPrizes]);
    } else if (newPrizesCount < prizes.length) {
      setPrizes(prizes.slice(0, newPrizesCount));
    }
  };

  const handlePrizeChange = (index: number, field: 'price' | 'rank', value: string) => {
    const updatedPrizes = [...prizes];
    updatedPrizes[index] = {
      ...updatedPrizes[index],
      [field]: value
    };
    setPrizes(updatedPrizes);
  };
  const cAUTournament = async () => {
    if (name.trim() === "" || startDate.trim() === "" || endDate.trim() === "" || listLevels.length === 0) {
      alert.alertCustom(2, 'กรุณาป้อนข้อมูลให้ครบ');
      return;
    }
    const item = await dispatch(createAndUpdateTournament({ id, name, startDate, endDate, listLevels, prizes, image }));
    if (item.payload !== "" && item.payload !== undefined) {
      alert.alertCustom(1, id === 0 ? "สร้างทัวร์นาเมนต์สำเร็จ" : "แก้ไขทัวร์นาเมนต์สำเร็จ");

      setTimeout(async () => {
        await dispatch(getTournament());
      }, 900);

      handleCloseModal();
    } else {
      alert.alertCustom(2, "เกิดข้อผิดพลาด!");
    }
  };

  const removeTournamentById = async (id: number) => {
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
        const item = await dispatch(removeTournament(id));
        if (item.payload !== "" && item.payload !== undefined) {
          Swal.fire({
            title: "ลบสำเร็จ!",
            icon: "success"
          });

          setTimeout(async () => {
            await dispatch(getTournament());
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

  const hideTournamentById = async (id: number) => {
    const t = tournaments && tournaments.find(x => x.id === Number(id));

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
        const item = await dispatch(statusHideTournament(id));
        if (item.payload !== "" && item.payload !== undefined) {
          Swal.fire({
            title: item.payload.isHide === false ? "ยกเลิกซ่อนสำเร็จ" : "ซ่อนสำเร็จ",
            icon: "success"
          });

          setTimeout(async () => {
            await dispatch(getTournament());
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
  const resetTournamentById = async (id: number) => {
    Swal.fire({
      title: "คุณต้องการรีเซ็ตทัวร์นาเม้นต์ใช่ไหม",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่ ฉันต้องการรีเซ็ตทัวร์นาเม้นต์",
      cancelButtonText: "ยกเลิก"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const item = await dispatch(resetTeamsAndDeleteMatches(id));
        if (item.payload !== "" && item.payload !== undefined) {
          Swal.fire({
            title: "รีเซ็ตทัวร์นาเม้นต์",
            icon: "success"
          });

          setTimeout(async () => {
            await dispatch(getMatch());
            await dispatch(getRegistration());
            await dispatch(getTournament());
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
  const handleYearChange = (_:any, newValue: any) => {
    setYear(newValue);
  };
  const getRootProp = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setImage(acceptedFiles[0]);
      }
    },
    multiple: false,
  });

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
              <h4>ค้นหาชื่อทัวร์นาเมนต์</h4>
              <Input
                placeholder="ค้นหา..."
                startDecorator={
                  <Button sx={{ width: 35 }} variant="soft" color="neutral" disabled startDecorator={<SearchIcon />} />
                }
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                sx={{ borderRadius: 8 }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2.5}>
            <FormControl >
              <h4>ระดับของทัวร์นาเมนต์</h4>
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

          {user && user?.role === "Admin" && (
            <Grid item xs={12} md={2.5}>
              <FormControl >
                <h4 style={{ textAlign: "center" }}>สร้างทัวร์นาเมนต์</h4>
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

        {paginatedTournament && paginatedTournament.length > 0 && paginatedTournament.map((tournament: any) => {
          const registrationsAll = registrations && Array.isArray(registrations)
            ? registrations.filter((reg) => reg.tournamentId === tournament.id)
            : [];
          const matchAll = matchs && Array.isArray(matchs)
            ? matchs.filter((match) =>
              registrationsAll && registrationsAll.some((reg) => reg.teamId === match.team1Id || reg.teamId === match.team2Id)
            )
            : [];
          return (
            <Card
              key={tournament.id} // แนะนำให้มี id สำหรับแต่ละทัวร์นาเมนต์
              orientation="horizontal"
              sx={{
                mb: 2, // เพิ่ม margin ด้านล่างเพื่อแยกแต่ละการ์ด
              }}
            >
              {windowSize > 720 &&
                <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
                  <img
                    src={tournament.gameImageUrl ? folderImage + tournament.gameImageUrl : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7yMx7Dj6gCVNPIoUszlAwdic0k0Vrk73-kw&s'}
                    loading="lazy"
                    alt={tournament.name}
                  />
                </AspectRatio>
              }
              <CardContent>
              {user && user?.role === "Admin" &&
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                  <IconButton onClick={() => handleOpenModal(tournament.id)}>
                    <EditIcon color='warning' />
                  </IconButton>

                  {tournament.isHide === false ?
                    <IconButton onClick={() => hideTournamentById(tournament.id)}>
                      <VisibilityIcon color='inherit' />
                    </IconButton>
                    :
                    <IconButton onClick={() => hideTournamentById(tournament.id)}>
                      <VisibilityOffIcon color='inherit' />
                    </IconButton>
                  }
                  <IconButton onClick={() => resetTournamentById(tournament.id)}>
                    <RestartAltIcon color='secondary' />
                  </IconButton>
                  <IconButton onClick={() => removeTournamentById(tournament.id)}>
                    <RemoveCircleOutlineIcon color='error' />
                  </IconButton>
                </Box>
              }
              {windowSize <= 720 &&
                <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
                  <img
                    src={tournament.gameImageUrl ? folderImage + tournament.gameImageUrl : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7yMx7Dj6gCVNPIoUszlAwdic0k0Vrk73-kw&s'}
                    loading="lazy"
                    alt={tournament.name}
                  />
                </AspectRatio>
              }
                <Box>
                  <h3>ชื่อทัวร์นาเมนต์: </h3>
                  <p>{tournament.name}</p>
                </Box>
                <h4>ระดับของทัวร์นาเมนต์:</h4>
                <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                  {tournament.listLevels && tournament.listLevels.map((level: any, index: number) => (
                    <span key={level.id}>
                      {levels && levels.find(x => x.id === level.levelId)?.name}
                      {index < tournament.listLevels.length - 1 ? ' , ' : ''}
                    </span>
                  ))}
                </Box>

                <Grid container spacing={2} sx={{ my: 1.5 }}>
                  <Grid item xs={4} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: 2}}>
                    <h4>เงินรางวัลรวม:</h4>
                    <p>{formatNumberWithCommas(tournament.prizes.reduce((acc:any, prize:any) => acc + prize.price, 0))} บาท</p>
                  </Grid>
                  <Grid item xs={4} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: 2 }}>
                    <h4>เวลาที่เริ่มการแข่ง:</h4>
                    <p>{formatDate(tournament.startDate)}</p>
                  </Grid>
                  <Grid item xs={4} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: 2}}>
                    <h4>เวลาที่สิ้นสุดการแข่ง:</h4>
                    <p>{formatDate(tournament.endDate)}</p>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' }, '& > button': { flex: 1 } }}>
                  {matchAll.length <= 0 && token !== "" ? (
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
                        <Button variant="outlined" color="neutral" onClick={() => regisTournament(tournament.id)}>
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
                            {teamByUser.filter((item: any) =>
                              tournament.listLevels.some((l: any) => l.levelId === item.levelId)
                            ).map((team: any) => {
                              const isRegistered = registrations && registrations.some(
                                (reg: any) => reg.tournamentId === tournament.id && reg.teamId === team.id
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
                        <Button variant="solid" color="primary" onClick={() => regisTournament(tournament.id)}>
                          <h4>ลงทะเบียนทีม</h4>
                        </Button>
                      </>
                    )
                  ) : null}

                  <Button variant="solid" color="primary" onClick={() => navigate.navigateToTournamentDetail(tournament.id)}>
                    <h4>รายละเอียดการแข่งขัน</h4>
                  </Button>
                </Box>
              </CardContent>

            </Card>
          )
        })}
        {filterResult && filterResult.length > 0 &&
          <Pagination
            count={Math.ceil(filterResult.length / itemsTournamentPage)}
            page={currentPage}
            onChange={handlePageChange}
            sx={{ marginTop: 2, alignItems: "center" }}
          />
        }
        <Modal open={openAddAndUpdateModal} onClose={handleCloseModal}>
          <ModalDialog sx={{
            width: { xs: '100%', sm: 600 }, // กว้าง 600 เมื่อหน้าจอขนาดกลางขึ้นไป
            maxWidth: '90%', // จำกัดความกว้างสูงสุดที่ 90% ของหน้าจอ
          }}>
            <ModalClose />
            <Box sx={{ overflow: 'auto', maxHeight: 600 }}>
              <Box>
                <h3></h3>
                <h4>ชื่อทัวร์นาเมนต์</h4>
                <Input name="name" fullWidth required value={name} onChange={(e) => setName(e.target.value)} />

                <h4 style={{ marginTop: 5 }}>ระดับทัวร์นาเมนต์</h4>
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
              <Box>
                <h4>รูปภาพเกม</h4>
                <div {...getRootProp.getRootProps()} style={dropzoneStyles}>
                  <input {...getRootProp.getInputProps()} />
                  {image ? (
                    <img src={typeof image === 'string' ? folderImage + image : URL.createObjectURL(image)} alt="Preview" style={previewStyles} />
                  ) : (
                    <p>ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกหนึ่งภาพ</p>
                  )}
                </div>

                <h4>
                  จำนวนรางวัล
                </h4>
                <Input name="membersCount" type='number' fullWidth required value={prizesCount} onChange={(e) => setPrizesCount(e.target.value)} />

                <Button variant="solid" sx={{ mt: 1 }} disabled={prizesCount ? false : true} onClick={handleAddPrizes}>
                  สร้างช่องกรอกรางวัล
                </Button>

                {prizes.map((prize, index) => (
                  <Box key={index} sx={{ mt: 2 }}>
                    <h4>{`รางวัลที่ ${index + 1}`}</h4>
                    <Input name="price" type="number" fullWidth required value={prize.price} onChange={(e) => handlePrizeChange(index, 'price', e.target.value)} />
                  </Box>
                ))}
                <Box>
                  <Box sx={{ textAlign: "end" }}>
                    <Button
                      variant="solid"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={cAUTournament}
                    >
                      ยืนยัน
                    </Button>
                  </Box>
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
                  onClick={hideTournamentByYear}
                >
                  ยืนยัน
                </Button>
              </Box>
            </Box>
          </ModalDialog>
        </Modal>
      </Box>
    </Container>
  );
}

const dropzoneStyles:any = {
  border: '2px dashed #ccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

const previewStyles:any = {
  maxWidth: '300px',
  maxHeight: '400px',
  marginTop: '10px',
};