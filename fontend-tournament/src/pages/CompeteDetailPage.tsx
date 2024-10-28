import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Alert2 from '../components/Alert2';
import NavigateCustom from '../components/NavigateCustom';
import { routes } from '../components/Path';
import { formatDate } from '../components/Reuse';
import { checkInRegistrationCompete, getRegistration, checkInAllRegistrationCompetes, cancelCheckInAllRegistrationCompetes, removeRegistrationCompete } from '../store/features/registrationSlice';
import { createAndUpdateTeam, getTeamByUser, getTeams } from '../store/features/teamSlice';
import { useAppSelector, useAppDispatch } from '../store/store';
import { Container, Box, Button, FormControl, Input, Tabs, TabList, Tab, TabPanel, Grid, IconButton, Modal, ModalDialog, ModalClose, Card, Select, Option, Chip } from '@mui/joy';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import * as XLSX from 'xlsx';
import { createAndUpdateCertificate, getCertificate } from '../store/features/certificateSlice';

export default function CompeteDetailPage() {
  const { id } = useParams();
  const { Competes } = useAppSelector((state) => state.compete);
  const { CompetitionList, Competitions } = useAppSelector((state) => state.competition);
  const { SignerDetails } = useAppSelector((state) => state.signer);
  const { TextInImages } = useAppSelector((state) => state.textInImage);
  const { registrationCompetes } = useAppSelector((state) => state.registration);
  const { teams } = useAppSelector((state) => state.team);
  const { user, token } = useAppSelector((state) => state.user);
  const { levels } = useAppSelector((state) => state.level);
  const dispatch = useAppDispatch()
  const alert = Alert2()
  const [searchTeamName, setSearchTeamName] = useState<string>("");
  const [openAddAndUpdateModal, setOpenAddAndUpdateModal] = useState(false);
  const [openMemberModal, setOpenMemberModal] = useState(false);
  const [teamId, setTeamId] = useState<number | null>(0);
  const [schoolName, setSchoolName] = useState('');
  const [levelId, setLevelId] = useState<number | null>(0);
  const [membersCount, setMembersCount] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [trainersCount, setTrainersCount] = useState('');
  const [trainers, setTrainers] = useState<any[]>([]);

  const [openCertificateModal, setOpenCertificateModal] = useState(false);
  const [certificatesCount, setCertificatesCount] = useState('');
  const [certificates, setCertificates] = useState<any[]>([]);
  const [listSignerDetails, setListSignerDetails] = useState<any[]>([]);
  const [textInImageId, setTextInImageId] = useState<number | null>(0);

  const compete = Competes && Competes.find((x: any) => x.id === Number(id));
  const competitionList = CompetitionList && CompetitionList.find((x: any) => x.id === Number(compete?.competitionListId));
  const competitions = Competitions && Competitions.find((x: any) => x.id === Number(competitionList?.competitionId));

  const findTeam = (teamId: number) => {
    return teams && teams.find(x => x.id === teamId)
  }

  const registrationCompetesAll = registrationCompetes && registrationCompetes.filter((x: any) => x.competeId === Number(id));
  const registrationCompetesNoCheckIn = registrationCompetesAll && registrationCompetesAll.filter((x: any) => x.status === 0);
  const registrationCompetesCheckIn = registrationCompetesAll && registrationCompetesAll.filter((x: any) => x.status !== 0);

  const filterRegNoCheckInResult = registrationCompetesNoCheckIn && registrationCompetesNoCheckIn.filter((x: any) => {
    const team = findTeam(x.teamId);  // ค้นหา team ตาม teamId
    return team && (
      searchTeamName === "" ||
      team.schoolName.toLowerCase().includes(searchTeamName.toLowerCase()) ||
      x.number.toString().includes(searchTeamName)  // ตรวจสอบหมายเลขโรงเรียน
    );
  });

  const filterRegCheckInResult = registrationCompetesCheckIn && registrationCompetesCheckIn.filter((x: any) => {
    const team = findTeam(x.teamId);  // ค้นหา team ตาม teamId
    return team && (
      searchTeamName === "" ||
      team.schoolName.toLowerCase().includes(searchTeamName.toLowerCase()) ||
      x.number.toString().includes(searchTeamName)  // ตรวจสอบหมายเลขโรงเรียน
    );
  });

  const currentDateInBuddhistEra = new Date();
  currentDateInBuddhistEra.setFullYear(currentDateInBuddhistEra.getFullYear());

  const [tabIndex, setTabIndex] = useState(0);

  //#region 
  const checkInReg = async (id: number) => {
    if (token !== "" && user?.role === "Admin") {
      const registration = registrationCompetes && registrationCompetes.find(x => x.id === id);
      const checkInSucessAndCancel = registration && registration.status === 1;

      if (compete && currentDateInBuddhistEra <= new Date(compete.endDate)) {
        const item = await dispatch(checkInRegistrationCompete(id));
        if (item.payload !== "" && item.payload !== undefined) {
          alert.alertCustom(1, !checkInSucessAndCancel ? "เช็คอินลงทะเบียนสำเร็จ" : "ยกเลิกลงทะเบียน");

          setTimeout(async () => {
            await dispatch(getRegistration());
          }, 900);
        } else {
          alert.alertCustom(2, "เกิดข้อผิดพลาด!");
        }
      } else {
        alert.alertCustom(2, "การแข่งขันสิ้นสุดแล้ว!");
      }
    }
    else return
  };

  //#region modal
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
  const handleOpenModal = (teamId: number) => {
    setOpenAddAndUpdateModal(true);
    const team = teams && teams.find(x => x.id === Number(teamId));

    if (team) {
      setTeamId(teamId);
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

  const handleCloseModal = () => {
    setOpenAddAndUpdateModal(false);
    setTeamId(0);
    setMembersCount('');
    setMembers([]);
    setTrainersCount('');
    setTrainers([]);
    setSchoolName('');
    setLevelId(0);
  };

  const handleOpenCertificateModal = () => {
    setOpenCertificateModal(true);
  };

  const handleCloseCertificateModal = () => {
    setOpenCertificateModal(false);
    setCertificatesCount('');
    setCertificates([]);
    setListSignerDetails([]);
    setTextInImageId(0);
  };

  const cAUCertificate = async () => {
    if (listSignerDetails.length <= 0 || textInImageId == null || certificates.length <= 0) {
      alert.alertCustom(2, 'กรุณาป้อนข้อมูลให้ครบ');
      return;
    }
    const allFilled = certificates.every(cer => cer.teamId); // เช็คว่า teamId ของทุกรางวัลมีค่าหรือไม่
    if (!allFilled) {
      alert.alertCustom(2, 'กรุณากรอกข้อมูลรางวัลทั้งหมด');
      return;
    }
    alert.showLoadingSpinner("กำลังบันทึกข้อมูล...");
    const item = await dispatch(createAndUpdateCertificate({ listCertificates: certificates, textInImageId, listSignerDetails }));
    alert.hideLoadingSpinner();
    if (item.payload !== "" && item.payload !== undefined) {
      alert.alertCustom(1, "สร้างเกียรติบัตรสำเร็จ");

      setTimeout(async () => {
        await dispatch(getCertificate());
      }, 900);

      handleCloseCertificateModal();
    } else {
      alert.alertCustom(2, "เกิดข้อผิดพลาด!");
    }
  };

  const handleTeamIdChange = (
    _event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setTeamId(newValue);
  };

  const handleSubmitMembers = async () => {
    if (schoolName === "" || levelId === 0) {
      return
    }
    const item = await dispatch(createAndUpdateTeam({ id: teamId, schoolName, listMembers: members, listTrainers: trainers, levelId }));
    if (item.payload !== "" && item.payload !== undefined) {
      alert.alertCustom(1, teamId === null ? "สร้างทีมสำเร็จ" : "แก้ไขทีมสำเร็จ");

      setTimeout(async () => {
        await dispatch(getTeamByUser());
        await dispatch(getTeams());
      }, 900);
      handleCloseModal();

    } else {
      alert.alertCustom(2, "เกิดข้อผิดพลาด!");
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
  const handleLevelChange = (
    _event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setLevelId(newValue);
  };
  const handleTextInImageChange = (
    _event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setTextInImageId(newValue);
  };
  const handleSignersChange = (
    _event: React.SyntheticEvent | null,
    newValue: number | number[] | null,
  ) => {
    setListSignerDetails(newValue as number[]);
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

  const handleAddCertificates = () => {
    const newCertificatesCount = Number(certificatesCount);
    if (newCertificatesCount > certificates.length) {
      const newC = Array.from({ length: newCertificatesCount - certificates.length }, (_, index) => ({
        name: competitions?.name,
        rank: getAwardTitle(index + certificates.length + 1),
        teamId: 0,
      }));
      setCertificates([...certificates, ...newC]);
    } else if (newCertificatesCount < certificates.length) {
      setCertificates(certificates.slice(0, newCertificatesCount));
    }
  };

  const handleCertificateChange = (index: number, field: 'name' | 'rank' | 'teamId', value: string) => {
    // ตรวจสอบว่า value ที่เลือกมาใช้งานอยู่หรือไม่
    const selectedIds = certificates.map(cer => cer.teamId);

    // หาก field เป็น 'teamId' และ value ถูกเลือกอยู่แล้ว ให้ไม่ทำอะไร
    if (field === 'teamId' && selectedIds.includes(value)) {
      return; // ไม่เปลี่ยนค่า ถ้า value ซ้ำ
    }

    const updatedCertificates = [...certificates];
    updatedCertificates[index] = {
      ...updatedCertificates[index],
      [field]: value
    };
    setCertificates(updatedCertificates);
  };

  const navigate = NavigateCustom()
  //#endregion
  const THSarabunNew = `${routes.home}THSarabunNew.ttf`;

  const downloadPdfByReg = () => {
    const doc = new jsPDF();
    const item = filterRegCheckInResult;
    const date = compete && formatDate(compete.startDate);

    // เพิ่มฟอนต์ Sarabun ที่รองรับภาษาไทย
    doc.addFileToVFS('THSarabunNew.ttf', THSarabunNew); // แทน THSarabunNew.ttf ด้วยชื่อของฟอนต์ไทยที่คุณใช้
    doc.addFont(THSarabunNew, 'THSarabunNew', 'normal');
    doc.setFont('THSarabunNew');
    doc.setFontSize(36);
    // กำหนดหัวข้อรอบ
    doc.text(`วันที่ ${date}`, 14, 20);
    doc.text(`จำนวนที่มาลงทะเบียน ${item.length} โรงเรียน`, 14, 20);

    const tableData = item.filter(x => x.number !== 0).map((i: any) => {
      const teamName = teams?.find((x) => x.id === i.teamId)?.schoolName || "";

      return [
        `${i.number}`,
        `${teamName}`,
      ];
    });

    // ใช้ jsPDF AutoTable เพื่อสร้างตารางคู่ทีมการแข่งขัน
    autoTable(doc, {
      head: [["ลำดับทีม", "ชื่อโรงเรียน"]],
      body: tableData,
      margin: { top: 30 },
      styles: { font: 'THSarabunNew', fontSize: 24 }
    });

    doc.save(`ลงทะเบียนหน้างาน.pdf`);
  };

  const downloadExcelByReg = () => {
    const item = filterRegCheckInResult;
    const date = compete ? formatDate(compete.startDate) : "Unknown Date";

    const tableData = item.filter(x => x.number !== 0).map((i: any) => {
      const teamName = teams?.find((x) => x.id === i.teamId)?.schoolName || "";
      return [
        `${i.number}`,
        `${teamName}`,
      ];
    });

    const header = [`วันที่ ${date}`];
    const header1 = [`จำนวนที่มาลงทะเบียน ${item.length} โรงเรียน`];
    const subHeader = ["ลำดับทีม", "ชื่อโรงเรียน"];

    // Create worksheet data
    const worksheetData = [
      header,
      header1,
      subHeader,
      ...tableData
    ];

    // Create worksheet from the data
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Ensure the sheet name is within the 31-character limit
    const sheetName = `ลงทะเบียนหน้างาน ${item.length}`;
    const truncatedSheetName = sheetName.length > 31 ? sheetName.substring(0, 31) : sheetName;

    // Append worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, truncatedSheetName);

    // Save the Excel file
    XLSX.writeFile(workbook, `ลงทะเบียนหน้างาน.xlsx`);
  };
  const checkInAll = async () => {
    if (compete && currentDateInBuddhistEra <= new Date(compete.endDate)) {
      const item = await dispatch(checkInAllRegistrationCompetes(Number(id)));
      if (item.payload !== "" && item.payload !== undefined) {
        alert.alertCustom(1, "เช็คอินทั้งหมด");
        setTimeout(async () => {
          await dispatch(getRegistration());
        }, 900);
      } else {
        alert.alertCustom(2, "เกิดข้อผิดพลาด!");
      }
    }
    else {
      alert.alertCustom(2, "การแข่งขันสิ้นสุดแล้ว!");
    }
  };
  const cancelCheckInAll = async () => {
    if (compete && currentDateInBuddhistEra <= new Date(compete.endDate)) {
      const item = await dispatch(cancelCheckInAllRegistrationCompetes(Number(id)));
      if (item.payload !== "" && item.payload !== undefined) {
        alert.alertCustom(1, "ยกเลิกเช็คอินทั้งหมด");

        setTimeout(async () => {
          await dispatch(getRegistration());

        }, 900);

      } else {
        alert.alertCustom(2, "เกิดข้อผิดพลาด!");
      }
    } else {
      alert.alertCustom(2, "การแข่งขันสิ้นสุดแล้ว!");
    }
  };
  const removeReg = async (id: number) => {
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
        if (compete && currentDateInBuddhistEra <= new Date(compete.endDate)) {
          const item = await dispatch(removeRegistrationCompete(id));
          if (item.payload !== "" && item.payload !== undefined) {
            alert.alertCustom(1, "ยกเลิกการลงทะเบียนเสร็จสิ้น");

            setTimeout(async () => {
              await dispatch(getRegistration());

            }, 900);

          } else {
            alert.alertCustom(2, "เกิดข้อผิดพลาด!");
          }
        } else {
          alert.alertCustom(2, "การแข่งขันสิ้นสุดแล้ว!");
        }
      }
    });

  };
  const getAwardTitle = (number: number) => {
    switch (number) {
      case 1:
        return 'รางวัลชนะเลิศ';
      case 2:
        return 'รางวัลรองชนะเลิศ อันดับที่ 1';
      case 3:
        return 'รางวัลรองชนะเลิศ อันดับที่ 2';
      default:
        return 'รางวัลชมเชย';
    }
  };
  //#endregion
  return (
    <Container>
      <Grid container spacing={2} alignItems="center">
        <Grid >
          <Button onClick={navigate.navigateToCompete} variant="solid" color="primary">
            กลับ
          </Button>
        </Grid>

        <Grid xs>
          <FormControl >
            <h4>ค้นหาชื่อโรงเรียน/ลำดับที่</h4>
            <Input
              placeholder="ค้นหา..."
              startDecorator={
                <Button sx={{ width: 35 }} variant="soft" color="neutral" disabled startDecorator={<SearchIcon />}>
                </Button>
              }
              value={searchTeamName}
              onChange={(e) => setSearchTeamName(e.target.value)}
              sx={{ borderRadius: 8 }}
            />
          </FormControl>
        </Grid>

        {token !== "" && user?.role === "Admin" && registrationCompetesCheckIn.length > 0 && (
          <Grid >
            <Button onClick={handleOpenCertificateModal} variant="solid" color="primary">
              เลือกผู้ชนะ
            </Button>
          </Grid>
        )}
      </Grid>
      <Box sx={{ marginTop: 2 }}></Box>
      <Tabs value={tabIndex} onChange={(_, newValue: any) => setTabIndex(newValue)}>
        <TabList>
          <Tab><h3>ทีมที่ลงทะเบียนทั้งหมด</h3></Tab>
          <Tab><h3>ทีมที่เช็คอินทั้งหมด</h3></Tab>
        </TabList>

        <TabPanel value={0}>
          <Box>
            <Box sx={{ display: "flex", gap: 5, alignItems: "center" }}>
              {user && user.role === "Admin" && filterRegNoCheckInResult.length > 0 && (
                <Button onClick={checkInAll} variant="solid" color="primary">
                  เช็คอินทั้งหมด
                </Button>
              )}
              {filterRegNoCheckInResult && filterRegNoCheckInResult.length > 0 &&
                filterRegNoCheckInResult.filter(x => x.number !== 0).length > 0 && (
                  <h4>จำนวนทีมที่ลงทะเบียนทั้งหมด {filterRegNoCheckInResult.filter(x => x.number !== 0).length} จำนวน</h4>
                )}
            </Box>

            <Grid container spacing={2}>
              {filterRegNoCheckInResult && filterRegNoCheckInResult.length > 0 &&
                filterRegNoCheckInResult.filter(x => x.number !== 0).map((reg: any) => {
                  const name = findTeam(reg.teamId)?.schoolName;
                  const member = findTeam(reg.teamId)?.listMembers;
                  return (
                    <Grid xs={12} sm={6} key={reg.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 5, marginTop: 2 }}>
                        <Box sx={{
                          width: 30,
                          height: 30,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#000',
                          color: 'white',
                          marginRight: 1,
                          borderRadius: 1,
                        }}>
                          <h4>{reg.number}</h4>
                        </Box>

                        <Button
                          size="md"
                          variant="soft"
                          color={reg.status === 1 || reg.status === 2 || reg.status === 3 ? "success" : "neutral"}
                          onClick={() => checkInReg(reg.id)}
                          disabled={token !== "" && user?.role === "Admin" ? false : true}
                        >
                          <h4>{name}</h4>
                        </Button>

                        <Box sx={{ marginLeft: 1 }}>
                          <IconButton onClick={() => handleMemberOpenModal(reg.teamId)}>
                            <GroupIcon color={member && member.length > 0 ? "inherit" : "disabled"} />
                          </IconButton>
                          {token !== "" && user?.role === "Admin" && (
                            <>
                              <IconButton onClick={() => handleOpenModal(reg.teamId)}>
                                <ModeEditIcon color='warning' />
                              </IconButton>
                              <IconButton onClick={() => removeReg(reg.teamId)}>
                                <RemoveCircleOutlineIcon color='error' />
                              </IconButton>
                            </>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={1}>
          <Box>
            <Box sx={{ display: "flex", gap: 5, alignItems: "center", justifyContent: 'flex-end' }}>
              {user && user.role === "Admin" && filterRegCheckInResult.length > 0 && (
                <Button onClick={cancelCheckInAll} variant="solid" color="primary">
                  ยกเลิกเช็คอินทั้งหมด
                </Button>
              )}
              {filterRegCheckInResult && filterRegCheckInResult.length > 0 &&
                filterRegCheckInResult.filter(x => x.number !== 0).length > 0 && (
                  <Box sx={{ display: 'flex', alignItems: "center" }}>
                    <h4>จำนวนเช็คอินทั้งหมด {filterRegCheckInResult.filter(x => x.number !== 0).length} จำนวน</h4>
                    <div style={{ marginLeft: 5 }}></div>
                    <Button onClick={downloadPdfByReg}><h4>ดาวน์โหลด PDF</h4></Button>
                    <div style={{ marginLeft: 5 }}></div>
                    <Button onClick={downloadExcelByReg}><h4>ดาวน์โหลด Excel</h4></Button>
                  </Box>
                )}
            </Box>

            <Grid container spacing={2}>
              {filterRegCheckInResult && filterRegCheckInResult.length > 0 &&
                filterRegCheckInResult.filter(x => x.number !== 0).map((reg: any) => {
                  const name = findTeam(reg.teamId)?.schoolName;
                  const member = findTeam(reg.teamId)?.listMembers;
                  return (
                    <Grid xs={12} sm={6} key={reg.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 5, marginTop: 2 }}>
                        <Box sx={{
                          width: 30,
                          height: 30,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#000',
                          color: 'white',
                          marginRight: 1,
                          borderRadius: 1,
                        }}>
                          <h4>{reg.number}</h4>
                        </Box>

                        <Button
                          size="md"
                          variant="soft"
                          color={reg.status === 1 || reg.status === 2 || reg.status === 3 ? "success" : "neutral"}
                          onClick={() => checkInReg(reg.id)}
                          disabled={token !== "" && user?.role === "Admin" ? false : true}
                        >
                          <h4>{name}</h4>
                        </Button>

                        <Box sx={{ marginLeft: 1 }}>
                          <IconButton onClick={() => handleMemberOpenModal(reg.teamId)}>
                            <GroupIcon color={member && member.length > 0 ? "inherit" : "disabled"} />
                          </IconButton>
                          {token !== "" && user?.role === "Admin" && (
                            <>
                              <IconButton onClick={() => handleOpenModal(reg.teamId)}>
                                <ModeEditIcon color='warning' />
                              </IconButton>
                              <IconButton onClick={() => removeReg(reg.teamId)}>
                                <RemoveCircleOutlineIcon color='error' />
                              </IconButton>
                            </>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
        </TabPanel>

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
                    <Grid xs={12} sm={6} key={index}>
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
                    <Grid xs={12} sm={6} key={index}>
                      <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                        <h4>
                          {t.name}
                        </h4>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <h4 style={{ marginBottom: 2, marginTop: 15 }}></h4>
                )}
              </Grid>
            </Box>
          </ModalDialog>
        </Modal>

        <Modal open={openAddAndUpdateModal} onClose={handleCloseModal}>
          <ModalDialog sx={{
            width: { xs: '100%', sm: 600 }, // กว้าง 600 เมื่อหน้าจอขนาดกลางขึ้นไป
            maxWidth: '90%', // จำกัดความกว้างสูงสุดที่ 90% ของหน้าจอ
          }}>
            <ModalClose />
            <Box sx={{ overflow: 'auto', maxHeight: 600 }}>
              <Box>
                <Box>
                  <h4>ต้องการแก้ไข</h4>
                  <Select
                    value={teamId}
                    onChange={handleTeamIdChange}
                    required
                    disabled
                  >
                    {teams && teams.map((l) => (
                      <Option key={l.id} value={l.id}>
                        {l.schoolName}
                      </Option>
                    ))
                    }
                  </Select>
                </Box>
                <h4>
                  ชื่อโรงเรียน
                </h4>
                <Input name="schoolName" fullWidth required value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
                <h4>ระดับอายุ</h4>
                <Select
                  value={levelId}
                  onChange={handleLevelChange}
                  required
                  disabled
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

        <Modal open={openCertificateModal} onClose={handleCloseCertificateModal}>
          <ModalDialog sx={{
            width: { xs: '100%', sm: 600 }, // กว้าง 600 เมื่อหน้าจอขนาดกลางขึ้นไป
            maxWidth: '90%', // จำกัดความกว้างสูงสุดที่ 90% ของหน้าจอ
          }}>
            <ModalClose />
            <Box sx={{ overflow: 'auto', maxHeight: 600 }}>
              <Box>
                <h4>วันที่ในข้อความ</h4>
                <Select
                  value={textInImageId}
                  onChange={handleTextInImageChange}
                  required
                >
                  {TextInImages && TextInImages.map((l) => (
                    <Option key={l.id} value={l.id}>
                      {l.text}
                    </Option>
                  ))
                  }
                </Select>

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
              <Box sx={{ mt: 2 }}>
                <h4>
                  จำนวนรางวัล
                </h4>
                <Input name="certificatesCount" type='number' fullWidth required value={certificatesCount} onChange={(e) => setCertificatesCount(e.target.value)} />
                <Button variant="solid" sx={{ mt: 1 }} disabled={certificatesCount ? false : true} onClick={handleAddCertificates}>
                  สร้างช่องกรอกรางวัล
                </Button>
                {certificates.map((cer, index) => (
                  <Box key={index} sx={{ mt: 2 }}>
                    <h4>{`ทีม ${index + 1}: ${getAwardTitle(index + 1)}`}</h4>
                    <Select
                      value={cer.teamId}
                      onChange={(_event, newValue) => handleCertificateChange(index, 'teamId', newValue)}
                      required
                    >
                      {registrationCompetesCheckIn && registrationCompetesCheckIn.map((l) => (
                        <Option key={l.id} value={l.teamId}>
                          [{l.number} {findTeam(l.teamId)?.schoolName}]
                        </Option>
                      ))}
                    </Select>
                  </Box>
                ))}

                <Box sx={{ textAlign: "end" }}>
                  <Button
                    variant="solid"
                    color="primary"
                    onClick={cAUCertificate}
                    sx={{ mt: 2 }}
                  >
                    ยืนยัน
                  </Button>
                </Box>
              </Box>
            </Box>
          </ModalDialog>
        </Modal>
      </Tabs>
    </Container>
  )
}
