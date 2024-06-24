
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SchoolIcon from '@mui/icons-material/School';
import Logout from '@mui/icons-material/Logout';
import BusinessIcon from '@mui/icons-material/Business';
import ListItem from '@mui/material/ListItem';
import ExpandLess from '@mui/icons-material/ExpandLess';
import EmailIcon from '@mui/icons-material/Email';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { AppBar, BadgeAmbiente, DrawerHeader, closedMixin, openedMixin } from './styles';
import { Badge, ClickAwayListener, Collapse } from '@mui/material';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import { useLocation, useNavigate } from 'react-router';
import SeletorTema from '@/components/ThemeSelector';
import { TemaContext } from '@/contexts/Tema';
import { matchPath } from 'react-router';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import ContentContainer from '../ContentContainer';
import { AppSettingsService, useGetAppSettings } from '@/core/services/appsettings';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { TemaService } from '@/core/services/tema';
import { Card, CardContent, Chip, Tooltip } from '@mui/joy';
import { SensorService } from '@/core/services/sensor';
import RuleApplierOutputModal from '../RuleApplierOutputModal';

const Layout = (props: any) => {
    const { isDarkTheme, setIsDarkTheme } = useContext(TemaContext);
    // const { data: usuario } = UsuarioService.useGetUserInfo();
    const { data: sensorData } = SensorService.useGetData();
    const { isMobile } = TemaService.useGetIsMobile();

    const Drawer = styled(MuiDrawer, {
        shouldForwardProp: (prop: any): boolean => {
            return prop !== 'open' || isMobile!;
        }
    })(
        ({ theme, open }: any) => ({
            width: 240,
            // flexShrink: 0,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            ...(open && {
                ...openedMixin(theme),
                '& .MuiDrawer-paper': openedMixin(theme),
            }),
            ...(!open && {
                ...closedMixin(theme),
                '& .MuiDrawer-paper': closedMixin(theme),
            }),
        }),
    );
    interface MenuItem {
        id: string,
        text: string,
        icon: any,
        path: string,
        subItems: any
    };
    const menuItems = [
        {
            id: 'home',
            text: 'Início',
            icon: <HomeIcon />,
            path: '/'
        },
        // {
        //     id: 'comunicacao',
        //     text: 'Comunicação',
        //     icon: <BadgeEmail />,
        //     path: '/comunicacao'
        // },
        // {
        //     id: 'cadastro',
        //     text: 'Cadastro',
        //     icon: <DescriptionIcon />,
        //     path: '/cadastro',
        //     subItems: [
        //         {
        //             text: 'Meus Dados',
        //             icon: <ContactPageIcon />,
        //             path: '/cadastro',
        //         },
        //         // {
        //         //     text: 'Dependentes',
        //         //     icon: <FamilyRestroomIcon />,
        //         //     path: '/cadastro/dependentes',
        //         // },
        //         {
        //             text: 'Instituição de Ensino',
        //             icon: <BusinessIcon />,
        //             path: '/cadastro/escola',
        //         },
        //     ],
        // },
        // {
        //     id: 'financeiro',
        //     text: 'Financeiro',
        //     icon: <AccountBalanceWallet />,
        //     path: '/financeiro',
        //     subItems: [
        //         {
        //             text: 'Faturas',
        //             icon: <BadgeFaturas />,
        //             path: '/financeiro',
        //         },
        //         {
        //             text: 'Imposto de Renda',
        //             icon: <Box sx={{ 'path': { fill: "currentColor" } }}>
        //                 <ReceitaFederalIcon style={{ width: '25px' }} />
        //             </Box>,
        //             path: '/financeiro/imposto-renda',
        //         },
        //         {
        //             text: 'Consultas Convênios',
        //             icon: <Box sx={{ 'path': { fill: "currentColor" } }}>
        //                 <LocalHospitalIcon />
        //             </Box>,
        //             path: '/financeiro/consultas-convenios',
        //         }
        //         // Add more subItems here as needed
        //     ],
        // },
        // {
        //     id: 'questionarios',
        //     text: 'Questionários',
        //     icon: <BadgeQuestionario />,
        //     path: '/questionarios',
        // },
        // {
        //     id: 'vantagens',
        //     text: 'Sinpro/RS Vantagens',
        //     icon: <CreditCardIcon />,
        //     path: '/vantagens',
        //     somenteSocio: true
        // },
        // Add more top-level items here as needed
    ];
    const [collapseStates, setCollapseStates] = useState<any>(
        {
            'financeiro': true,
            'cadastro': true,
        }
    );
    const navigate = useNavigate()
    const { pathname } = useLocation();
    const { data: appSettings } = AppSettingsService.useGetAppSettings();

    const toggleCollapseState = (id: string) => {
        setCollapseStates((prevCollapseStates: any) => ({
            ...prevCollapseStates,
            [id]: !collapseStates[id],
        }));
    };
    useEffect(() => {
        localStorage.getItem('drawerOpen') == 'true' ? setOpen(true) : setOpen(false);
    }, []);

    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const toggleDrawer = () => {
        localStorage.setItem('drawerOpen', !open ? 'true' : 'false');
        setOpen(!open);
    }

    const InnerListItemButton = styled(ListItemButton)(({ /*{ theme } unused */ }: any) => ({
        paddingBottom: '5px',
        paddingTop: '5px',
        paddingLeft: open ? '30px' : '15px'
    }));
    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <AppBar position="fixed" open={open}>
                    <Toolbar sx={{ justifyContent: "space-between", paddingRight: "0" }}>
                        <IconButton
                            color="inherit"
                            aria-label="Abrir menu"
                            onClick={toggleDrawer}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                // ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        {/* <Typography className="mr-4" component="div" sx={{ flex: 'auto', display: 'flex' }}>
                            {viewProfessor?.Nome} */}
                        {/* <div> */}
                        {/* <SituacaoIcon sx={{ width: '10px', color: "green" }} /> */}
                        {/* <span style={{ fontSize: "15px", top: '-1px', position: 'relative', color: 'green' }}>
                                    {viewProfessor.SituacaoSinpro}
                                </span> */}
                        {/* <Chip
                                    color="success"
                                    variant="solid"
                                    size="sm"
                                    sx={{fontSize: '10px', marginLeft: '10px'}}
                                >
                                    {viewProfessor.SituacaoSinpro}
                                </Chip> */}
                        {/* </div> */}
                        {/* </Typography> */}
                        {/* <ContentProfile /> */}
                        
                        <RuleApplierOutputModal />
                        <Card color="success" sx={{ textAlign: 'right', display: 'flex', paddingY: '5px' }}>
                            <CardContent sx={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Box sx={{ height: '100%' }}>
                                    <DeviceThermostatIcon />
                                    
                                </Box>
                                <Box sx={{ mr: 3 }}>
                                    <Typography>
                                        Temperatura:
                                    </Typography>
                                    <Typography>
                                        Umidade:
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography>
                                        {sensorData?.temperature} ºC
                                    </Typography>
                                    <Typography>
                                        {sensorData?.humidity} %
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant={isMobile ? "temporary" : "permanent"}
                    onClose={toggleDrawer}
                    open={open}
                    elevation={14}
                >
                    <DrawerHeader>
                        <Typography variant="h6" noWrap sx={{ flex: 'auto' }}>
                            <Typography sx={{ cursor: "pointer" }} onClick={() => navigate('/home')}>
                                Datacenter Automated Controller
                                {appSettings?.ENVIRONMENT != "main" &&
                                    <BadgeAmbiente component="span">
                                        {appSettings?.ENVIRONMENT}
                                    </BadgeAmbiente>
                                }
                            </Typography>
                        </Typography>
                        <IconButton onClick={toggleDrawer}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {menuItems.map((item: any) => (
                            <Tooltip
                                title=""
                                arrow
                                color="danger"
                                key={item.id}>
                                <div >
                                    <ListItem
                                        key={item.id}
                                        disablePadding
                                        sx={{ display: 'block' }}
                                        onClick={
                                            item.subItems
                                                ? () => toggleCollapseState(item.id)
                                                : () => navigate(item.path)
                                        }
                                    >
                                        <ListItemButton
                                            disabled={false}
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: open ? 'initial' : 'center',
                                                px: 2.5,
                                            }}
                                            selected={matchPath(item.path + "/*" as string, pathname) !== null}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 0,
                                                    mr: open ? 3 : 'auto',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {item?.icon}
                                            </ListItemIcon>
                                            {open && <ListItemText primary={item.text} />}
                                            {item.subItems ? (
                                                collapseStates[item.id] ? (
                                                    <ExpandLess sx={{ width: '18px' }} />
                                                ) : (
                                                    <ExpandMore sx={{ width: '18px' }} />
                                                )
                                            ) : null}
                                        </ListItemButton>
                                    </ListItem>
                                    {item.subItems ? (
                                        <Collapse
                                            in={collapseStates[item.id]}
                                            timeout="auto"
                                            unmountOnExit
                                        >
                                            <List component="div" disablePadding>
                                                {item.subItems?.map((subItem: any) => (
                                                    <ListItem
                                                        key={subItem.path}
                                                        sx={{ padding: 0 }}
                                                    >
                                                        <InnerListItemButton
                                                            onClick={() => navigate(subItem.path)}
                                                            selected={matchPath(subItem.path, pathname) !== null}>
                                                            <ListItemIcon>
                                                                <SubdirectoryArrowRightIcon sx={{ width: '10px' }} />
                                                                {subItem.icon}
                                                            </ListItemIcon>
                                                            {open && <ListItemText primary={subItem.text} />}
                                                        </InnerListItemButton>
                                                    </ListItem>
                                                ))}
                                            </List>
                                            <Divider />
                                        </Collapse>
                                    ) : null}
                                </div>

                            </Tooltip>
                        ))}
                    </List>
                    <List sx={{
                        flex: 'auto',
                        display: 'flex',
                        placeItems: 'self-end',
                        paddingBottom: '0'
                    }}>
                        <ListItem key="4" disablePadding sx={{ display: 'block' }}>
                            <Divider />
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                    // padding: 0,
                                }}
                                onClick={() => setIsDarkTheme(!isDarkTheme)}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <SeletorTema size={40} />

                                </ListItemIcon>
                                {open &&
                                    <ListItemText primary={"Seletor de Tema"} sx={{ opacity: open ? 1 : 0 }} />
                                }
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, margin: '15px' }}>
                    <DrawerHeader />
                    <ContentContainer>
                        {props.children}
                        {/* {!isLoadingErrorAppSettings && <AlertaReconectando />} */}
                    </ContentContainer>
                </Box>
            </Box >
        </>
    );
}
export default Layout;