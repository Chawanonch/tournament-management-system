import { Modal, AspectRatio, Button, Card, CardContent, Container, Tab, TabList, TabPanel, Tabs, Box, Option, Input, ModalDialog, ModalClose, Select, IconButton } from '@mui/joy'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAppDispatch, useAppSelector } from '../store/store';
import { useEffect, useState } from 'react';
import { getUserAdmin } from '../store/features/userSlice';
import Alert2 from '../components/Alert2';
import { createAndUpdateTeam, getTeamByUser, getTeams, removeTeam } from '../store/features/teamSlice';
import { Grid, Pagination } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Swal from 'sweetalert2';

export default function TeamsPage() {
  const { teams, teamByUser } = useAppSelector((state) => state.team);
  const { users } = useAppSelector((state) => state.user);
  const { levels } = useAppSelector((state) => state.level);
  const { token } = useAppSelector((state) => state.user);
  const [tabIndex, setTabIndex] = useState(0);
  const dispatch = useAppDispatch()

  const [openAddAndUpdateModal, setOpenAddAndUpdateModal] = useState(false);
  const [openMemberModal, setOpenMemberModal] = useState(false);
  const [id, setId] = useState<number>(0);
  const [teamId, setTeamId] = useState<number | null>(0);
  const [schoolName, setSchoolName] = useState('');
  const [levelId, setLevelId] = useState<number | null>(0);
  const [membersCount, setMembersCount] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [trainersCount, setTrainersCount] = useState('');
  const [trainers, setTrainers] = useState<any[]>([]);
  const alert = Alert2()

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentByPage, setCurrentByPage] = useState<number>(1);
  const itemsTeamPage = 6;
  const paginatedTeam = teams && teams.filter(x => x.schoolName !== "Bot Team").slice((currentPage - 1) * itemsTeamPage, currentPage * itemsTeamPage);
  const paginatedTeamByUser = teamByUser && teamByUser.filter(x => x.schoolName !== "Bot Team").slice((currentByPage - 1) * itemsTeamPage, currentByPage * itemsTeamPage);
  const handlePageTeamChange = (_: React.ChangeEvent<unknown>, value: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(value);
  };
  const handlePageTeamByUserChange = (_: React.ChangeEvent<unknown>, value: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentByPage(value);
  };
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getUserAdmin());
    };

    fetchData();
  }, [dispatch]);

  const handleOpenModal = (id: number) => {
    setOpenAddAndUpdateModal(true);
    setId(id)
  };

  const handleCloseModal = () => {
    setOpenAddAndUpdateModal(false);
    setTeamId(0);
    setMembersCount('');
    setMembers([]);
    setTrainersCount('');
    setTrainers([]);
    setSchoolName('');
    setLevelId(0);
    setId(0)
  };

  const handleMemberOpenModal = (teamId: number) => {
    const team = teams && teams.find(x => x.id === Number(teamId));

    setOpenMemberModal(true);
    setMembers(team && team.listMembers.length > 0 ? team.listMembers : []);
    setTrainers(team && team.listTrainers.length > 0 ? team.listTrainers : []);
    setTeamId(teamId)
  };

  const handleMemberCloseModal = () => {
    setOpenMemberModal(false);
    setMembers([]);
    setTrainers([]);
    setTeamId(0)
  };
  const handleAddMembers = () => {
    const newMembersCount = Number(membersCount);
    if (newMembersCount > members.length) {
      const newMembers = Array.from({ length: newMembersCount - members.length }, (_) => ({
        name: '',
        position: ''
      }));
      setMembers([...members, ...newMembers]);
    } else if (newMembersCount < members.length) {
      setMembers(members.slice(0, newMembersCount));
    }
  };

  const handleMemberChange = (index: number, field: 'name' | 'position', value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value
    };
    setMembers(updatedMembers);
  };

  const handleAddTrainers = () => {
    const newTrainersCount = Number(trainersCount);
    if (newTrainersCount > trainers.length) {
      const newTrainers = Array.from({ length: newTrainersCount - trainers.length }, (_) => ({
        name: '',
        position: ''
      }));
      setTrainers([...trainers, ...newTrainers]);
    } else if (newTrainersCount < trainers.length) {
      setTrainers(trainers.slice(0, newTrainersCount));
    }
  };

  const handleTrainerChange = (index: number, field: 'name' | 'position', value: string) => {
    const updatedTrainers = [...trainers];
    updatedTrainers[index] = {
      ...updatedTrainers[index],
      [field]: value
    };
    setTrainers(updatedTrainers);
  };

  const handleLevelChange = (
    _event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setLevelId(newValue);
  };

  const handleTeamIdChange = (
    _event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    const team = teamByUser && teamByUser.find(x => x.id === Number(newValue));
    if (team) {
      setTeamId(newValue);
      setMembersCount(team.listMembers.length > 0 ? String(team.listMembers.length) : '');
      setMembers(team.listMembers);
      setTrainersCount(team.listTrainers.length > 0 ? String(team.listTrainers.length) : '');
      setTrainers(team.listTrainers);
      setSchoolName(team.schoolName);
      setLevelId(team.levelId);
    }
    else {
      setTeamId(0);
      setMembersCount('');
      setMembers([]);
      setTrainersCount('');
      setTrainers([]);
      setSchoolName('');
      setLevelId(0);
    }
  };

  const handleSubmitMembers = async () => {
    if (schoolName === "" || levelId === 0) {
      return
    }
    const item = await dispatch(createAndUpdateTeam({ id: teamId, schoolName, listMembers: members, listTrainers: trainers, levelId }));
    if (item.payload !== "" && item.payload !== undefined) {
      alert.alertCustom(1, teamId === 0 ? "สร้างทีมสำเร็จ" : "แก้ไขทีมสำเร็จ");

      setTimeout(async () => {
        await dispatch(getTeamByUser());
        await dispatch(getTeams());
      }, 900);
      handleCloseModal();

    } else {
      alert.alertCustom(2, "เกิดข้อผิดพลาด!");
    }
  };
  const removeTeamByUser = async (id: number) => {
    Swal.fire({
      title: "คุณต้องการลบทีมใช่ไหม",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่ ฉันต้องการลบทีม",
      cancelButtonText: "ยกเลิก"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const item = await dispatch(removeTeam(id));
        if (item.payload !== "" && item.payload !== undefined) {
          alert.alertCustom(1, "ลบทีมสำเร็จ");

          setTimeout(async () => {
            await dispatch(getTeamByUser());
            await dispatch(getTeams());
          }, 900);
        } else {
          alert.alertCustom(2, "เกิดข้อผิดพลาด!");
        }
      }
    });
  };
  return (
    <Container>
      <Tabs value={tabIndex} onChange={(_, newValue: any) => setTabIndex(newValue)}>
        <TabList>
          <Tab><h3>ทีมทั้งหมด</h3></Tab>
          {token !== "" &&
            <Tab><h3>ทีมของฉัน</h3></Tab>
          }
          {token !== "" &&
            <Button onClick={() => handleOpenModal(0)} sx={{ ml: 1 }}><h3>สร้างทีม</h3></Button>
          }
          {token !== "" && paginatedTeamByUser && paginatedTeamByUser.length > 0 &&
            <Button onClick={() => handleOpenModal(1)} sx={{ ml: 1 }} color='warning'><h3>แก้ไขทีม</h3></Button>
          }
        </TabList>
        <TabPanel value={0}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{ flexGrow: 1 }}
          >
            {paginatedTeam && paginatedTeam.map((team: any, index: number) => (
              <Grid item xs={4} sm={4} md={4} key={index}>
                <Card>
                  <CardContent>
                    <h3>ชื่อโรงเรียน: {team.schoolName}</h3>
                    <p>ทีมสร้างโดย: {users && users.find(x => x.id === team.userId)?.username}</p>
                    <p>ระดับ: {levels && levels.find(x => x.id === team.levelId)?.name}</p>
                  </CardContent>
                  <AspectRatio minHeight="120px" maxHeight="200px">
                    <AccountCircleIcon />
                  </AspectRatio>
                  <CardContent>
                    <Button
                      variant="solid"
                      size="md"
                      color="primary"
                      aria-label="Explore Bahamas Islands"
                      sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 }}
                      onClick={() => handleMemberOpenModal(team.id)}

                    >
                      รายละเอียดสมาชิก
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {teams && teams.length > 0 && (
              <Grid item xs={12}>
                <Pagination
                  count={Math.ceil(teams.length / itemsTeamPage)}
                  page={currentPage}
                  onChange={handlePageTeamChange}
                  sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
                />
              </Grid>
            )}
          </Grid>
        </TabPanel>

        <TabPanel value={1}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{ flexGrow: 1 }}
          >
            {token && paginatedTeamByUser && paginatedTeamByUser.map((team: any, index: number) => (
              <Grid item xs={4} sm={4} md={4} key={index}>
                <Card>
                  <IconButton onClick={() => removeTeamByUser(team.id)} sx={{ position: "absolute", right: 10 }}>
                    <RemoveCircleOutlineIcon color="error" />
                  </IconButton>
                  <div>
                    <h3>ชื่อโรงเรียน: {team.schoolName}</h3>
                    <p>ทีมสร้างโดย: {users && users.find(x => x.id === team.userId)?.username}</p>
                    <p>ระดับ: {levels && levels.find(x => x.id === team.levelId)?.name}</p>
                  </div>
                  <AspectRatio minHeight="120px" maxHeight="200px">
                    <AccountCircleIcon />
                  </AspectRatio>
                  <CardContent orientation="horizontal">
                    <Button
                      variant="solid"
                      size="md"
                      color="primary"
                      aria-label="Explore Bahamas Islands"
                      sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 }}
                      onClick={() => handleMemberOpenModal(team.id)}
                    >
                      รายละเอียดสมาชิก
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {token && teamByUser && teamByUser.length > 0 &&
              <Grid item xs={12}>
                <Pagination
                  count={Math.ceil(teamByUser.length / itemsTeamPage)}
                  page={currentByPage}
                  onChange={handlePageTeamByUserChange}
                  sx={{ marginTop: 2, display: 'flex', alignItems: "center" }}
                />
              </Grid>
            }
          </Grid>
        </TabPanel>
      </Tabs>

      <Modal open={openAddAndUpdateModal} onClose={handleCloseModal}>
        <ModalDialog sx={{ 
            width: { xs: '100%', sm: 600 }, // กว้าง 600 เมื่อหน้าจอขนาดกลางขึ้นไป
            maxWidth: '90%', // จำกัดความกว้างสูงสุดที่ 90% ของหน้าจอ
          }}>
          <ModalClose />
          <Box sx={{ overflow: 'auto', maxHeight: 600 }}>
            <Box>
              {id !== 0 &&
                <Box>
                  <h4>ต้องการแก้ไขทีมไหน</h4>
                  <Select
                    value={teamId}
                    onChange={handleTeamIdChange}
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
                    {teamByUser && teamByUser.filter(x => x.schoolName !== "Bot Team").map((l) => (
                      <Option key={l.id} value={l.id}>
                        {l.schoolName}
                      </Option>
                    ))
                    }
                  </Select>
                </Box>
              }
              <h4>
                ชื่อโรงเรียน
              </h4>
              <Input name="schoolName" fullWidth required value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
              <h4>ระดับอายุ</h4>
              <Select
                value={levelId}
                onChange={handleLevelChange}
                required
              >
                {levels && levels.map((l) => (
                  <Option key={l.id} value={l.id}>
                    {l.name}
                  </Option>
                ))
                }
              </Select>

            </Box>
            <Box>
              <h4>
                เพิ่มสมาชิกในทีม
              </h4>
              <Input name="membersCount" type='number' fullWidth required value={membersCount} onChange={(e) => setMembersCount(e.target.value)} />

              <Button variant="solid" sx={{ mt: 1 }} disabled={membersCount ? false : true} onClick={handleAddMembers}>
                สร้างช่องกรอกข้อมูล
              </Button>

              {members.map((member, index) => (
                <Box key={index} sx={{ mt: 2 }}>
                  <h4>{`ชื่อสมาชิก ${index + 1}`}</h4>
                  <Input name="name" fullWidth required value={member.name} onChange={(e) => handleMemberChange(index, 'name', e.target.value)} />
                </Box>
              ))}

              <h4>
                เพิ่มผู้ฝึกสอนในทีม
              </h4>
              <Input name="trainersCount" type='number' fullWidth required value={trainersCount} onChange={(e) => setTrainersCount(e.target.value)} />

              <Button variant="solid" sx={{ mt: 1 }} disabled={trainersCount ? false : true} onClick={handleAddTrainers}>
                สร้างช่องกรอกข้อมูล
              </Button>

              {trainers.map((trainer, index) => (
                <Box key={index} sx={{ mt: 2 }}>
                  <h4>{`ชื่อผู้ฝึกสอน ${index + 1}`}</h4>
                  <Input name="name" fullWidth required value={trainer.name} onChange={(e) => handleTrainerChange(index, 'name', e.target.value)} />
                </Box>
              ))}
              <Box sx={{ textAlign: "end" }}>
                <Button
                  variant="solid"
                  color="primary"
                  onClick={handleSubmitMembers}
                  sx={{ mt: 2 }}
                >
                  ยืนยัน
                </Button>
              </Box>
            </Box>
          </Box>
        </ModalDialog>
      </Modal>

      <Modal open={openMemberModal} onClose={handleMemberCloseModal}>
        <ModalDialog sx={{ 
            width: { xs: '100%', sm: 600 }, // กว้าง 600 เมื่อหน้าจอขนาดกลางขึ้นไป
            maxWidth: '90%', // จำกัดความกว้างสูงสุดที่ 90% ของหน้าจอ
          }}>
          <ModalClose />
          <Box sx={{ overflow: 'auto', maxHeight: 600, p: 2 }}>
            {members.length > 0 && (
              <h4 style={{ marginBottom: 2 }}>
                รายชื่อสมาชิกทั้งหมด
              </h4>
            )}
            <Grid container spacing={2}>
              {members.length > 0 ? (
                members.map((m, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <h4>
                        {m.name}
                      </h4>
                    </Card>
                  </Grid>
                ))
              ) : (
                <h4></h4>
              )}
            </Grid>
            {trainers.length > 0 && (
              <h4 style={{ marginBottom: 2 }}>
                รายชื่อผู้ฝึกสอนทั้งหมด
              </h4>
            )}
            <Grid container spacing={2}>
              {trainers.length > 0 ? (
                trainers.map((t, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <h4>
                        {t.name}
                      </h4>
                    </Card>
                  </Grid>
                ))
              ) : (
                <h4 style={{ marginBottom: 2,marginTop: 15 }}></h4>
              )}
            </Grid>
          </Box>
        </ModalDialog>
      </Modal>
    </Container>
  )
}
