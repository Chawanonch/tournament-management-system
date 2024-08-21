import { Container, Box, Card, AspectRatio, CardContent, Sheet, Button,  FormControl, Select, Option, Input, IconButton, Modal, ModalClose, ModalDialog, Chip } from '@mui/joy';
import { useAppDispatch, useAppSelector } from '../store/store';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Pagination } from '@mui/material';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import { createAndUpdateRegistration, getRegistration } from '../store/features/registrationSlice';
import Alert2 from '../components/Alert2';
import { convertToBuddhistYear, convertToGregorianYear, formatDate } from '../components/Reuse';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { createAndUpdateTournament, getTournament, removeTournament, statusHideTournament } from '../store/features/tournamentSlice';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { getMatch, resetTeamsAndDeleteMatches } from '../store/features/matchSlice';
import NavigateCustom from '../components/NavigateCustom';

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
  const [id, setId] = useState<number>(0);
  const navigate = NavigateCustom()

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
      const t = tournaments && tournaments.find(x => x.id === id);

      if (t) {
        setId(id)
        setName(t.name)
        setStartDate(t.startDate.toString().split('T')[0])
        setEndDate(t.endDate.toString().split('T')[0])
        if (listLevels) setListLevels(t.listLevels.map(x => x.levelId))
        else setListLevels([])
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
    currentDateInBuddhistEra.setFullYear(currentDateInBuddhistEra.getFullYear() + 543);

    if (tournament && currentDateInBuddhistEra <= new Date(tournament.endDate)) {
      const registrationData = checkRole ? { tournamentId, teamName } : { tournamentId, teamId };

      const item = await dispatch(createAndUpdateRegistration(registrationData));
      if (item.payload !== "" && item.payload !== undefined) {
        alert.alertCustom(1, "ลงทะเบียนทีมสำเร็จ!");

        setTimeout(async () => {
          await dispatch(getRegistration());
        }, 900);

        setAddTeam("")
        setSelectTeam(0)
      } else {
        alert.alertCustom(2, "เกิดข้อผิดพลาด!");
      }
    } else {
      alert.alertCustom(2, "ไม่สามารถลงทะเบียนได้ เนื่องจากการแข่งขันสิ้นสุดแล้ว!");
    }
  }

  const cAUTournament = async () => {
    if (name.trim() === "" || startDate.trim() === "" || endDate.trim() === "" || listLevels.length === 0) {
      alert.alertCustom(2, 'กรุณาป้อนข้อมูลให้ครบ');
      return;
    }

    const item = await dispatch(createAndUpdateTournament({ id, name, startDate, endDate, listLevels }));
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
    Swal.fire({
      title: "คุณต้องการซ่อนใช่ไหม",
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

  return (
    <Container>
      <Box
        sx={{
          width: '100%',
          position: 'relative',
          overflow: { xs: 'auto', sm: 'initial' },
        }}
      >
        <div style={{ display: 'flex' }}>
          <FormControl sx={{ maxWidth: 800, flex: 1 }}>
            <h4>
              ค้นหาชื่อทัวร์นาเมนต์
            </h4>
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

          <div style={{ marginLeft: 10 }}></div>

          <FormControl sx={{ maxWidth: 200, flex: 1 }}>
            <h4>ระดับของทัวร์นาเมนต์</h4>
            <Select defaultValue={0} onChange={handleChange}>
              <Option value={0}>
                ทั้งหมด
              </Option>
              {levels.map((level) => (
                <Option key={level.id} value={level.id}>
                  {level.name}
                </Option>
              ))}
            </Select>
          </FormControl>

          <div style={{ marginLeft: 10 }}></div>
          {user && user?.role === "Admin" &&
            <FormControl sx={{ maxWidth: 200, flex: 1 }}>
              <h4 style={{ textAlign: "center" }}>สร้างทัวร์นาเมนต์</h4>

              <IconButton onClick={() => handleOpenModal()}>
                <AddCircleOutlineIcon color='success' />
              </IconButton>
            </FormControl>
          }
        </div>
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
                width: '100%',
                mb: 2, // เพิ่ม margin ด้านล่างเพื่อแยกแต่ละการ์ด
              }}
            >
              {user && user?.role === "Admin" &&
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
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

              <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
                <img
                  src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7yMx7Dj6gCVNPIoUszlAwdic0k0Vrk73-kw&s'
                  loading="lazy"
                  alt={tournament.name}
                />
              </AspectRatio>
              <CardContent>
                <Box>
                  <h3>ชื่อทัวร์นาเมนต์: </h3>
                  <p>{tournament.name}</p>
                </Box>
                <h4>ระดับของทัวร์นาเมนต์:</h4>
                <Box sx={{ display: "Flex", flexDirection: "row", flexWrap: "wrap" }}>
                  {tournament.listLevels && tournament.listLevels.map((level: any) => (
                    <p key={level.id}> {levels && levels.find(x => x.id === level.levelId)?.name} ,</p>
                  ))}
                </Box>

                <Sheet
                  sx={{
                    bgcolor: 'background.level1',
                    borderRadius: 'sm',
                    p: 1.5,
                    my: 1.5,
                    display: 'flex',
                    gap: 2,
                    '& > div': { flex: 1 },
                  }}
                >
                  <div>
                    <h4>เวลาที่เริ่มการแข่ง:</h4>
                    <p>{formatDate(tournament.startDate)}</p>
                  </div>
                  <div>
                    <h4>เวลาที่สิ้นสุดการแข่ง:</h4>
                    <p>{formatDate(tournament.endDate)}</p>
                  </div>
                  <div>
                    <h4>วันที่สร้างแข่ง:</h4>
                    <p>{formatDate(tournament.dateCreated)}</p>
                  </div>
                </Sheet>

                <Box sx={{ display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
                  {matchAll.length <= 0 &&
                    token !== "" ? (
                    user?.role === "Admin" ? (
                      <>
                        <Input
                          placeholder="ชื่อโรงเรียน..."
                          startDecorator={
                            <Button sx={{ width: 35 }} variant="soft" color="neutral" disabled startDecorator={<SupervisedUserCircleIcon />}>
                            </Button>
                          }
                          value={addTeam}
                          onChange={(e) => setAddTeam(e.target.value)}
                          sx={{ borderRadius: 8 }}
                        />
                        <Button variant="outlined" color="neutral" onClick={() => regisTournament(tournament.id)}>
                          ลงทะเบียนด่วน (กรอกชื่อโรงเรียน)
                        </Button>
                      </>
                    ) : (
                      <>
                        {teamByUser.length > 0 ? (
                          <Select defaultValue={selectTeam} onChange={handleTeamChange}
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
                            <Option value={0}>
                              ทีมของฉัน
                            </Option>
                            {teamByUser && teamByUser
                              .filter((item: any) =>
                                tournament.listLevels.some((l: any) => l.levelId === item.levelId)
                              )
                              .map((team: any) => {
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
                          ลงทะเบียนทีม
                        </Button>
                      </>
                    )
                  ) : null
                  }
                  <Button variant="solid" color="primary" onClick={() => navigate.navigateToTournamentDetail(tournament.id)}>
                    รายละเอียดการแข่งขัน
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
          <ModalDialog>
            <ModalClose />
            <Box sx={{ overflow: 'auto', maxHeight: 600, width: 600 }}>
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
                }} name="startDate" required value={id !== 0 ? startDate : convertToBuddhistYear(startDate)} onChange={(e) => {
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
                }} name="endDate" required disabled={!startDate} value={id !== 0 ? endDate : convertToBuddhistYear(endDate)} onChange={(e) => {
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
          </ModalDialog>
        </Modal>
      </Box>
    </Container>
  );
}
