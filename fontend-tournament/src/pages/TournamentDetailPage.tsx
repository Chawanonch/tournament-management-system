import { Tabs, Tab, TabPanel, Container, TabList, Button, Box, FormControl, Input, Option, Modal, ModalDialog, ModalClose, Card, IconButton, Select } from '@mui/joy';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { cancelCheckInAllRegistrations, checkInAllRegistrations, checkInRegistration, getRegistration, removeRegistration } from '../store/features/registrationSlice';
import Alert2 from '../components/Alert2';
import NavigateCustom from '../components/NavigateCustom';
import SearchIcon from '@mui/icons-material/Search';
import { Match } from '../components/models/Match';
import { getMatch, randomMatch, updateMatch } from '../store/features/matchSlice';
import Swal from 'sweetalert2';
import { Grid } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { createAndUpdateTeam, getTeamByUser, getTeams } from '../store/features/teamSlice';
import THSarabunNew from "../components/Font/THSarabunNew.ttf";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { routes } from '../components/Path';
import CheckIcon from '@mui/icons-material/Check';

export default function TournamentDetailPage() {
    const { id } = useParams();
    const { matchs } = useAppSelector((state) => state.match);
    const { tournaments } = useAppSelector((state) => state.tournament);
    const { registrations } = useAppSelector((state) => state.registration);
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
    const [selectedRoundIndex, setSelectedRoundIndex] = useState(0);
    
    const tournament = tournaments && tournaments.find((x:any) => x.id === Number(id));
    const findTeam = (teamId: number) => {
        return teams && teams.find(x => x.id === teamId)
    }

    const registrationsAll = registrations && registrations.filter((x:any) => x.tournamentId === Number(id));
    const registrationsNoCheckIn = registrationsAll && registrationsAll.filter((x:any) => x.status !== 1 && x.status !== 2 && x.status !== 3);
    const registrationsCheckIn = registrationsAll && registrationsAll.filter((x:any) => x.status === 1 || x.status === 2 || x.status === 3);

    const matchAll = (matchs || []).filter((match) =>
        (registrationsCheckIn || []).some((reg) => 
            match && (reg.teamId === match.team1Id || reg.teamId === match.team2Id)
        )
    );

    const filterRegNoCheckInResult = registrationsNoCheckIn && registrationsNoCheckIn.filter((x:any)  => {
        const team = findTeam(x.teamId);  // ค้นหา team ตาม teamId
        return team && (
            searchTeamName === "" ||
            team.schoolName.toLowerCase().includes(searchTeamName.toLowerCase()) ||
            x.number.toString().includes(searchTeamName)  // ตรวจสอบหมายเลขโรงเรียน
        );
    });

    const filterRegCheckInResult = registrationsCheckIn && registrationsCheckIn.filter((x:any) => {
        const team = findTeam(x.teamId);  // ค้นหา team ตาม teamId
        return team && (
            searchTeamName === "" ||
            team.schoolName.toLowerCase().includes(searchTeamName.toLowerCase()) ||
            x.number.toString().includes(searchTeamName)  // ตรวจสอบหมายเลขโรงเรียน
        );
    });

    const filterMatchAllResult = matchAll && matchAll.filter((x:any)  => {
        const team1 = findTeam(x.team1Id);  // ค้นหา team1 ตาม team1Id
        const team2 = findTeam(x.team2Id);  // ค้นหา team2 ตาม team2Id

        const registration1 = registrationsCheckIn.find(reg => reg.teamId === x.team1Id);
        const registration2 = registrationsCheckIn.find(reg => reg.teamId === x.team2Id);

        return (
            (team1 && (
                searchTeamName === "" ||
                team1.schoolName.toLowerCase().includes(searchTeamName.toLowerCase()) ||
                (registration1 && registration1.number.toString().includes(searchTeamName))  // ตรวจสอบหมายเลขโรงเรียนของ team1 จาก registrationsCheckIn
            )) ||
            (team2 && (
                searchTeamName === "" ||
                team2.schoolName.toLowerCase().includes(searchTeamName.toLowerCase()) ||
                (registration2 && registration2.number.toString().includes(searchTeamName))  // ตรวจสอบหมายเลขโรงเรียนของ team2 จาก registrationsCheckIn
            ))
        );
    });

    const matchesByRound = filterMatchAllResult && filterMatchAllResult.reduce((acc: any, match) => {
        (acc[match.round] = acc[match.round] || []).push(match);
        return acc;
    }, {});

    const currentDateInBuddhistEra = new Date();
    currentDateInBuddhistEra.setFullYear(currentDateInBuddhistEra.getFullYear() + 543);

    const [tabIndex, setTabIndex] = useState(0);
    const regChDF = matchAll && matchesByRound[selectedRoundIndex + 1] || []; 
    const regCh = regChDF && regChDF.length > 0 && regChDF.filter((m:any) => m.winnerTeamId === 0) || [];

    //#region 
    const checkInReg = async (id: number) => {
        if (matchAll.length > 0) {
            alert.alertCustom(2, "การแข่งเริ่มแล้ว ไม่สามารถแก้ไขได้");
            return
        }
        if (token !== "" && user?.role === "Admin") {
            const registration = registrations && registrations.find(x => x.id === id);
            const checkInSucessAndCancel = registration && registration.status === 1;

            if (tournament && currentDateInBuddhistEra <= new Date(tournament.endDate)) {
                const item = await dispatch(checkInRegistration(id));
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

    const randomMatchAndStart = async (notOneRound?: number) => {
        Number(id);
        if (filterRegCheckInResult.length < 2) {
            alert.alertCustom(2, "ทีมยังจำนวนไม่พอกับการแข่งขัน!");
            return
        }

        const item = await dispatch(randomMatch({ tournamentId: id, notOneRound }));
        if (item.payload !== "" && item.payload !== undefined && item.payload !== null) {
            alert.alertCustom(1, "เริ่มการแข่งขัน");

            setTimeout(async () => {
                await dispatch(getMatch());
                await dispatch(getRegistration());
            }, 900);
        } else {
            alert.alertCustom(2, "เกิดข้อผิดพลาด!");
        }
    };

    const updateWinningTeam = async (matchId: number, winningTeamId: number, schoolName?: string) => {

        const item = await dispatch(updateMatch({ matchId, winningTeamId }));
        if (item.payload !== "" && item.payload !== undefined) {
            alert.alertCustom(1, schoolName + " ชนะ");

            setTimeout(async () => {
                await dispatch(getMatch());
                await dispatch(getRegistration());
            }, 900);
        } else {
            alert.alertCustom(2, "เกิดข้อผิดพลาด!");
        }
    };
    const handleMemberOpenModal = (teamId: number) => {
        const team = teams && teams.find(x => x.id === Number(teamId));

        setOpenMemberModal(true);
        setMembers(team && team.listMembers.length > 0 ? team.listMembers : []);
        setTeamId(teamId)
    };

    const handleMemberCloseModal = () => {
        setOpenMemberModal(false);
        setMembers([]);
        setTeamId(0)
    };
    const handleOpenModal = (teamId: number) => {
        setOpenAddAndUpdateModal(true);
        const team = teams && teams.find(x => x.id === Number(teamId));

        if (team) {
            setTeamId(teamId);
            setMembersCount(team.listMembers.length > 0 ? String(team.listMembers.length) : '');
            setMembers(team.listMembers);
            setSchoolName(team.schoolName);
            setLevelId(team.levelId);
        }
        else {
            setTeamId(0);
            setMembersCount('');
            setMembers([]);
            setSchoolName('');
            setLevelId(0);
        }
    };

    const handleCloseModal = () => {
        setOpenAddAndUpdateModal(false);
        setTeamId(0);
        setMembersCount('');
        setMembers([]);
        setSchoolName('');
        setLevelId(0);
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
        const item = await dispatch(createAndUpdateTeam({ id: teamId, schoolName, listMembers: members, levelId }));
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
    const handleMemberChange = (index: number, field: string, value: string) => {
        const updatedMembers = [...members];
        updatedMembers[index][field] = value;
        setMembers(updatedMembers);
    };
    const handleLevelChange = (
        _event: React.SyntheticEvent | null,
        newValue: number | null,
    ) => {
        setLevelId(newValue);
    };
    const handleAddMembers = () => {
        const newMembers = Array.from({ length: Number(membersCount) }, (_) => ({
            name: '',
            position: ''
        }));
        setMembers(newMembers);
    };
    const navigate = NavigateCustom()
    const navigatee = useNavigate();
    const handleRoundChange = (index: number) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSelectedRoundIndex(index);
    };

    const handleOneTwoThree = () => {
        // รวม winnerTeamId ทั้งหมด
        const winnerTeamIds = Object.values(matchesByRound).flatMap((round: any) => round.map((match: any) => match.winnerTeamId));

        // นับจำนวนการเกิดขึ้นของแต่ละ winnerTeamId
        const winnerTeamIdCounts = winnerTeamIds.reduce((acc, winnerId) => {
            acc[winnerId] = (acc[winnerId] || 0) + 1;
            return acc;
        }, {});

        // เรียงลำดับตามจำนวนการเกิดขึ้น
        const sortedWinnerTeamIds = Object.entries(winnerTeamIdCounts)
            .sort((a: any, b: any) => b[1] - a[1])
            .map(([winnerId]) => winnerId);

        // ตรวจสอบว่าคู่สุดท้ายแข่งขันเสร็จสิ้นหรือยัง
        const lastRound: any = Object.values(matchesByRound).pop();
        const isLastRoundComplete = lastRound.every((match: any) => match.winnerTeamId !== undefined);

        // เลือก 3 อันดับแรก ถ้าคู่สุดท้ายแข่งขันเสร็จสิ้น
        const top3WinnerTeamIds = isLastRoundComplete ? sortedWinnerTeamIds.slice(0, 3) : [];

        const top3Teams = top3WinnerTeamIds.map((teamId, index) => {
            const team = findTeam(Number(teamId));
            return {
                rank: index + 1,
                schoolName: team ? team.schoolName : 'ไม่พบข้อมูลทีม'
            };
        });

        navigatee(routes.announce, { state: { top3Teams } });
    };

    const downloadPdfByRound = (round: string, matches: any) => {
        const doc = new jsPDF();

        // เพิ่มฟอนต์ Sarabun ที่รองรับภาษาไทย
        doc.addFileToVFS('THSarabunNew.ttf', THSarabunNew); // แทน THSarabunNew.ttf ด้วยชื่อของฟอนต์ไทยที่คุณใช้
        doc.addFont(THSarabunNew, 'THSarabunNew', 'normal');
        doc.setFont('THSarabunNew');

        doc.setFontSize(36);
        // กำหนดหัวข้อรอบ
        doc.text(`รอบ ${round}`, 14, 20);

        const tableData = matches.map((m: any) => {
            const team1Name = teams?.find((x) => x.id === m.team1Id)?.schoolName || "";
            const team2Name = teams?.find((x) => x.id === m.team2Id)?.schoolName || "";
            const numberT1 = registrationsCheckIn?.find(x => x.id === m.team1Id)?.number || "";
            const numberT2 = registrationsCheckIn?.find(x => x.id === m.team2Id)?.number || "";
            return [
                `${numberT1} ${team1Name}`,
                `vs`,
                `${numberT2} ${team2Name}`
            ];
        });

        // ใช้ jsPDF AutoTable เพื่อสร้างตารางคู่ทีมการแข่งขัน
        autoTable(doc, {
            head: [["ทีม 1", "vs", "ทีม 2"]],
            body: tableData,
            margin: { top: 30 },
            styles: { font: 'THSarabunNew', fontSize: 28 }
        });

        doc.save(`การแข่ง_รอบที่_${round}.pdf`);
    };

    const downloadExcelByRound = (round: string, matches: any) => {
        const tableData = matches.map((m: any) => {
            const team1Name = teams?.find((x) => x.id === m.team1Id)?.schoolName || "";
            const team2Name = teams?.find((x) => x.id === m.team2Id)?.schoolName || "";
            const numberT1 = registrationsCheckIn?.find(x => x.id === m.team1Id)?.number || "";
            const numberT2 = registrationsCheckIn?.find(x => x.id === m.team2Id)?.number || "";
            return [
                `${numberT1} ${team1Name}`,
                'vs',
                `${numberT2} ${team2Name}`
            ];
        });

        // เพิ่มหัวข้อ "รอบที่" ที่บรรทัดแรก
        const header = [`รอบที่ ${round}`];
        const subHeader = ["ทีม 1", "vs", "ทีม 2"];

        // สร้าง worksheet จากข้อมูล โดยเพิ่มหัวข้อที่บรรทัดแรก
        const worksheet = XLSX.utils.aoa_to_sheet([[header], subHeader, ...tableData]);

        // สร้าง workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `รอบที่ ${round}`);

        // บันทึกไฟล์ Excel
        XLSX.writeFile(workbook, `การแข่ง_รอบที่_${round}.xlsx`);
    };
    const checkInAll = async () => {
        if (tournament && currentDateInBuddhistEra <= new Date(tournament.endDate)) {
            const item = await dispatch(checkInAllRegistrations(Number(id)));
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
        if (tournament && currentDateInBuddhistEra <= new Date(tournament.endDate)) {
            const item = await dispatch(cancelCheckInAllRegistrations(Number(id)));
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
                if (tournament && currentDateInBuddhistEra <= new Date(tournament.endDate)) {
                    const item = await dispatch(removeRegistration(id));
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
//#endregion
    return (
        <Container>
            <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: "row", width: "100%" }}>
                <Button onClick={navigate.navigateToTournament} variant="solid" color="primary">
                    กลับ
                </Button>
                <FormControl sx={{ flexGrow: 1, mx: 2 }}>
                    <h4>
                        ค้นหาชื่อโรงเรียน/ลำดับที่
                    </h4>
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

                {token !== "" && user?.role === "Admin" && regChDF.length !== 1 && regCh.length === 0 && filterRegCheckInResult.length > 0 &&
                    <Button onClick={() => randomMatchAndStart(matchAll.length > 0 ? 1 : 0)} variant="solid" color="primary">
                        เริ่มการแข่งขัน
                    </Button>
                }

                {regChDF.length === 1 && regCh.length === 0 &&
                    <Button onClick={() => handleOneTwoThree()} variant="solid" color="primary">
                        จบการแข่งขัน
                    </Button>
                }
            </Box>
            <Box sx={{ marginTop: 2 }}></Box>
            <Tabs value={tabIndex} onChange={(_, newValue: any) => setTabIndex(newValue)}>
                <TabList>
                    <Tab><h3>การแข่งขัน</h3></Tab>
                    <Tab><h3>ทีมที่ลงทะเบียนทั้งหมด</h3></Tab>
                    <Tab><h3>ทีมที่เช็คอินทั้งหมด</h3></Tab>
                </TabList>

                <TabPanel value={0}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
                        {Object.entries(matchesByRound || {}).map(([round, matches]: any, index: number) => (
                            <Box key={round} sx={{ display: index === selectedRoundIndex ? 'flex' : 'none', flexDirection: 'column', gap: 2, minWidth: 250, width: '100%' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        {Object.keys(matchesByRound || {}).map((_, index) => (
                                            <Button key={index} onClick={() => handleRoundChange(index)} sx={{ margin: 1 }}>
                                                <h4>รอบ {index + 1}</h4>
                                            </Button>
                                        ))}
                                    </Box>
                                    <h1 style={{ textAlign: 'center' }}>รอบ {round}</h1>
                                    <p> จำนวน {matches && (matches as Match[]).length} คู่  {regCh.length > 0 && "เหลือ " + regCh.length + " ที่ยังไม่ได้ผู้ชนะ"}</p>
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Button onClick={() => downloadPdfByRound(round, matches)}><h4>ดาวน์โหลด PDF</h4></Button>
                                        <div style={{ marginLeft: 5 }}></div>
                                        <Button onClick={() => downloadExcelByRound(round, matches)}><h4>ดาวน์โหลด Excel</h4></Button>
                                    </Box>
                                </Box>
                                <Grid container spacing={2} justifyContent="center">
                                    {matches && (matches as Match[]).map((m) => {
                                        const team1Name = teams?.find(x => x.id === m.team1Id)?.schoolName;
                                        const team2Name = teams?.find(x => x.id === m.team2Id)?.schoolName;
                                        const numberT1 = registrationsCheckIn?.find(x => x.id === m.team1Id)?.number;
                                        const numberT2 = registrationsCheckIn?.find(x => x.id === m.team2Id)?.number;
                                        const isTeam1Winner = m.winnerTeamId === m.team1Id;
                                        const isTeam2Winner = m.winnerTeamId === m.team2Id;

                                        return (
                                            <Grid
                                                item
                                                xs={12}
                                                sm={matches.length === 1 ? 12 : 6 } // ปรับตามจำนวนแมตช์
                                                key={m.id}
                                                sx={{ minWidth: 300, mt: 1 }} // กำหนดความกว้างขั้นต่ำเพื่อป้องกันการแคบเกินไป
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        gap: 2,
                                                        border: '1px solid #000',
                                                        borderRadius: 2,
                                                        padding: 2,
                                                        backgroundColor: "#625097", // ใช้สีพื้นหลังที่กำหนด
                                                    }}
                                                >
                                                    {/* Team 1 */}
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#000', borderRadius: 1 }}>
                                                            <h4 style={{ fontSize: 40, color: "red", paddingLeft: 5, paddingRight: 5 }}>{numberT1 !== 0 ? numberT1 : ''}</h4>
                                                        </Box>
                                                        <Button
                                                            size="lg"
                                                            variant="solid"
                                                            fullWidth
                                                            color="danger"
                                                            onClick={() => updateWinningTeam(m.id, m.team1Id, team1Name)}
                                                            disabled={!(token !== "" && user?.role === "Admin" && numberT1 !== 0)}
                                                            sx={{ textTransform: 'none', bgcolor: isTeam1Winner ? '#37e94d' : m.winnerTeamId === 0 ? "#000" : "#aca4c2" }}
                                                        >
                                                            <h2>{numberT1 !== 0 ? team1Name : ''}</h2>
                                                        </Button>
                                                        {isTeam1Winner &&
                                                            <CheckIcon sx={{ color: "#37e94d" ,fontSize:36}}/>
                                                        }
                                                    </Box>
                                                    {/* Team 2 */}
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#000', borderRadius: 1 }}>
                                                            <h4 style={{ fontSize: 40, color: "red", paddingLeft: 5, paddingRight: 5 }}>{numberT2 !== 0 ? numberT2 : ''}</h4>
                                                        </Box>
                                                        <Button
                                                            size="lg"
                                                            variant="solid"
                                                            fullWidth
                                                            color="danger"
                                                            onClick={() => updateWinningTeam(m.id, m.team2Id, team2Name)}
                                                            disabled={!(token !== "" && user?.role === "Admin" && numberT2 !== 0)}
                                                            sx={{ textTransform: 'none', bgcolor: isTeam2Winner ? '#37e94d' : m.winnerTeamId === 0 ? "#000" : "#aca4c2" }}
                                                        >
                                                            <h2>{numberT2 !== 0 ? team2Name : ''}</h2>
                                                        </Button>
                                                        {isTeam2Winner &&
                                                            <CheckIcon sx={{ color: "#37e94d" ,fontSize:36}}/>
                                                        }
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Box>
                        ))}
                    </Box>
                </TabPanel>

                <TabPanel value={1}>
                    <Box>
                        <Box sx={{ display: "flex", gap: 5, alignItems: "center" }}>
                            {matchAll.length === 0 && user && user.role === "Admin" && filterRegNoCheckInResult.length > 0 &&
                                <Button onClick={checkInAll} variant="solid" color="primary">
                                    เช็คอินทั้งหมด
                                </Button>
                            }
                            {filterRegNoCheckInResult && filterRegNoCheckInResult.length > 0 && filterRegNoCheckInResult.filter(x => x.number !== 0).length > 0 &&
                                <h4>จำนวนทีมที่ลงทะเบียนทั้งหมด {filterRegNoCheckInResult.filter(x => x.number !== 0).length} จำนวน</h4>
                            }
                        </Box>

                        <Grid container spacing={2}>
                            {filterRegNoCheckInResult && filterRegNoCheckInResult.length > 0 && filterRegNoCheckInResult.filter(x => x.number !== 0).map((reg: any) => (
                                <Grid item xs={6} key={reg.id}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginLeft: 5,
                                            marginTop: 2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 30,
                                                height: 30,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: '#000',
                                                color: 'white',
                                                marginRight: 1,
                                                borderRadius: 1,
                                            }}
                                        >
                                            <h4>{reg.number}</h4>
                                        </Box>

                                        <Button
                                            size="md"
                                            variant="soft"
                                            color={reg.status === 1 || reg.status === 2 || reg.status === 3 ? "success" : "neutral"}
                                            onClick={() => checkInReg(reg.id)}
                                            disabled={token !== "" && user?.role === "Admin" ? false : true}
                                        >
                                            {findTeam(reg.teamId)?.schoolName}
                                        </Button>

                                        <Box sx={{ marginLeft: 1 }}>
                                            <IconButton onClick={() => handleMemberOpenModal(reg.teamId)}>
                                                <GroupIcon />
                                            </IconButton>
                                            {token !== "" && user?.role === "Admin" &&
                                                <IconButton onClick={() => handleOpenModal(reg.teamId)}>
                                                    <ModeEditIcon color='warning' />
                                                </IconButton>
                                            }
                                            {token !== "" && user?.role === "Admin" &&
                                                <IconButton onClick={() => removeReg(reg.teamId)}>
                                                    <RemoveCircleOutlineIcon color='error' />
                                                </IconButton>
                                            }
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </TabPanel>

                <TabPanel value={2}>
                    <Box>
                        <Box sx={{ display: "flex", gap: 5, alignItems: "center" }}>
                            {matchAll.length === 0 && user && user.role === "Admin" && filterRegCheckInResult.length > 0 &&
                                <Button onClick={cancelCheckInAll} variant="solid" color="primary">
                                    ยกเลิกเช็คอินทั้งหมด
                                </Button>
                            }
                            {filterRegCheckInResult && filterRegCheckInResult.length > 0 &&filterRegCheckInResult.filter(x => x.number !== 0).length > 0 &&
                                <h4>จำนวนเช็คอินทั้งหมด {filterRegCheckInResult.filter(x => x.number !== 0).length} จำนวน</h4>
                            }
                        </Box>
                        <Grid container spacing={2}>
                            {filterRegCheckInResult && filterRegCheckInResult.length > 0 && filterRegCheckInResult.filter(x => x.number !== 0).map((reg: any) => (
                                <Grid item xs={6} key={reg.id}> {/* xs={6} จะแบ่งครึ่งหน้าจอสำหรับสองทีม */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginLeft: 5,
                                            marginTop: 2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 30,
                                                height: 30,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: '#000',
                                                color: 'white',
                                                marginRight: 1,
                                                borderRadius: 1,
                                            }}
                                        >
                                            <h4>{reg.number}</h4>
                                        </Box>

                                        <Button
                                            size="md"
                                            variant="soft"
                                            color={reg.status === 1 || reg.status === 2 || reg.status === 3 ? "success" : "neutral"}
                                            onClick={() => checkInReg(reg.id)}
                                            disabled={token !== "" && user?.role === "Admin" ? false : true}
                                        >
                                            {findTeam(reg.teamId)?.schoolName}
                                        </Button>

                                        <Box sx={{ marginLeft: 1 }}>
                                            <IconButton onClick={() => handleMemberOpenModal(reg.teamId)}>
                                                <GroupIcon />
                                            </IconButton>
                                            {token !== "" && user?.role === "Admin" &&
                                                <IconButton onClick={() => handleOpenModal(reg.teamId)}>
                                                    <ModeEditIcon color='warning' />
                                                </IconButton>
                                            }
                                            {token !== "" && user?.role === "Admin" &&
                                                <IconButton onClick={() => removeReg(reg.teamId)}>
                                                    <RemoveCircleOutlineIcon color='error' />
                                                </IconButton>
                                            }
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </TabPanel>

                <Modal open={openMemberModal} onClose={handleMemberCloseModal}>
                    <ModalDialog>
                        <ModalClose />
                        <Box sx={{ overflow: 'auto', maxHeight: 600, width: 600, p: 2 }}>
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
                                    <h4>ไม่มีสมาชิก</h4>
                                )}
                            </Grid>
                        </Box>
                    </ModalDialog>
                </Modal>
                <Modal open={openAddAndUpdateModal} onClose={handleCloseModal}>
                    <ModalDialog>
                        <ModalClose />
                        <Box sx={{ overflow: 'auto', maxHeight: 600, width: 600 }}>
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
                                <Input name="schoolName" disabled fullWidth required value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
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

            </Tabs>
        </Container>
    );
}
