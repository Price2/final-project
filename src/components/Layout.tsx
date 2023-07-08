import * as React from 'react';
import { styled, useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Menu, { MenuProps } from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Switch, { SwitchProps } from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Fab from '@mui/material/Fab';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState, useAppDispatch } from '../app/store';
import BoardModal from './BoardModal';
import { toggleAddTasks, toggleCreateBoard, toggleDeleteBoard, toggleEditBoard } from '../features/modalSlice';
import { fetchSelectedBoard, setCurrentSelectedBoard } from '../features/boardSlice';
import { toggleMode } from '../features/modeSlice';
import EditIcon from '@mui/icons-material/Edit';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const floatActionBtn = {
    margin: 0,
    top: 'auto',
    right: 'auto',
    bottom: 20,
    left: -15,
    borderRadius: '0px 100px 100px 0px',
    position: 'fixed',
};

const hideSideBarBtn = {
    margin: 0,
    top: 'auto',
    right: 'auto',
    bottom: 20,
    left: -15,
    // borderRadius: '0px 100px 100px 0px',
    position: 'fixed',
};

const toggleModeBtn = {
    margin: 0,
    top: 'auto',
    right: 'auto',
    bottom: 80,
    left: 'auto',
    // borderRadius: '0px 100px 100px 0px',
    position: 'fixed',
};

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));


const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 12,
        height: 12,
        borderRadius: 6,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));

type Props = {
    children: React.ReactNode;
}


const MyStyled = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

export default function PersistentDrawerLeft({ children }: Props) {
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [isListsRetrived, setisListsRetrived] = React.useState(false)
    const openAnchor = Boolean(anchorEl);
    const boards = useSelector((state: RootState) => state.boards);
    const selectedBoard = useSelector((state: RootState) => state.boards.selectedBoard);
    const mode = useSelector((state: RootState) => state.mode.mode);
    const dispatch: AppDispatch = useAppDispatch();


    console.log("loading boards ", boards)
    const [BoardanchorEl, setBoardAnchorEl] = React.useState<null | HTMLElement>(null);
    const openBoardDropDown = Boolean(BoardanchorEl);


    const handleBoardDropDownClick = (event: React.MouseEvent<HTMLElement>) => {
        setBoardAnchorEl(event.currentTarget);
    };
    const handleBoardDropDownClose = () => {
        setBoardAnchorEl(null);
    };








    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleCreateBoard = () => {
        dispatch(toggleCreateBoard(true));
    }

    const setSelectedBoard = (board: any) => {
        console.log("board selected ", board);

        dispatch(fetchSelectedBoard(board.id))
        // dispatch(setCurrentSelectedBoard(board))

    }

    const handleEditBoard = () => {
        setAnchorEl(null);
        dispatch(toggleEditBoard(true))
    }

    const handleDeleteBoard = () => {
        setAnchorEl(null);
        dispatch(toggleDeleteBoard(true))
    }

    const toggleAddTask = () => {
        dispatch(toggleAddTasks(true))
    }

    const handleMode = (e: any) => {
        console.log("true or false? ", e.target.checked)
        if (!e.target.checked) {
            dispatch(toggleMode('light-mode'))
            document.body.style.backgroundColor = "#F4F7FD"
        }
        else {
            document.body.style.backgroundColor = "#2B2C37"
            dispatch(toggleMode('dark-mode'))
        }
    }

    React.useEffect(() => {
        if (mode === 'light-mode') {
            document.body.style.backgroundColor = "#F4F7FD"

        }
        else {
            document.body.style.backgroundColor = "#20212C"
        }

    }, [mode])



    React.useEffect(() => {
        if (selectedBoard.length && selectedBoard[0].lists.length) {
            setisListsRetrived(true)
        }
        else {
            setisListsRetrived(false)
        }
    }, [selectedBoard])


    console.log("are there lists? ", isListsRetrived)
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar sx={{ backgroundColor: mode === 'light-mode' ? 'var(--white, #fff)' : "var(--very-dark-grey-dark-bg, #2B2C37)", }} position="fixed" open={open}>
                <Toolbar sx={{
                    justifyContent: 'space-between',
                    flexWrap: "nowrap"
                }}>
                    <div style={{ display: "flex" }}>
                        {mode === 'light-mode' ? <img src={require('../images/logo.svg').default} style={{ ...(open && { display: 'none' }) }} />
                            : <img src={require('../images/logo_dark_mode.svg').default} style={{ ...(open && { display: 'none' }) }} />}
                        <Divider orientation="vertical" flexItem sx={{ height: "68px", mx: '32px', ...(open && { display: 'none' }) }} />

                        <h6 className="logo-header-text" style={{
                            color: mode === 'light-mode' ? 'var(--very-dark-grey-dark-bg, #20212C)' : "var(--white, #fff)",
                            whiteSpace: 'nowrap',
                        }}>
                            Platform Launch

                        </h6>
                        <Box sx={{ alignSelf: 'center', display: { xs: "block", md: "none" } }}>

                            <Button
                                id="demo-customized-button"
                                aria-controls={openBoardDropDown ? 'demo-customized-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openBoardDropDown ? 'true' : undefined}
                                disableElevation
                                onClick={handleBoardDropDownClick}
                                startIcon={!openBoardDropDown ? <img src={require("../images/arrow_dropdown_icon.svg").default} /> : <img src={require("../images/arrow_up_icon.svg").default} />}
                                size='small'
                                sx={{ maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px', alignSelf: 'center', ml: '9px' }}
                            >

                            </Button>
                            <StyledMenu
                                id="demo-customized-menu"
                                MenuListProps={{
                                    'aria-labelledby': 'demo-customized-button',
                                }}
                                anchorEl={BoardanchorEl}
                                open={openBoardDropDown}
                                onClose={handleBoardDropDownClose}
                                sx={{
                                    "& ul": {
                                        backgroundColor:mode==='dark-mode'?'#2B2C37':""
                                    }
                                }}
                            >
                                <List>
                                    <p className='sidebar-small-text'>
                                        ALL BOARDS
                                    </p>
                                    {boards.AllBoards.map((board, index) => {

                                        const isSelected = selectedBoard.length ? board.id === selectedBoard[0].id ? true : false : false;
                                        return (

                                            <ListItem key={index} disablePadding>
                                                <ListItemButton onClick={() => { handleBoardDropDownClose(); setSelectedBoard(board) }}
                                                    sx={{
                                                        backgroundColor: isSelected ? 'var(--main-purple, #635FC7)' : "ffffff",
                                                        borderRadius: '0px 100px 100px 0px',
                                                        maxWidth: '90%',

                                                        '&:hover': {
                                                            backgroundColor: '#f0effa',
                                                            '& .hoveredColor': {
                                                                color: 'var(--main-purple, #635FC7)'
                                                            }
                                                        }

                                                    }} >
                                                    <img src={require('../images/board-icon.svg').default} style={{ marginRight: "16px" }} />
                                                    <ListItemText disableTypography primary={board.name} className='hoveredColor' sx={{
                                                        color: isSelected ? 'white' : 'var(--medium-grey, #828FA3)',
                                                        fontSize: '15px',
                                                        fontFamily: 'Plus Jakarta Sans',
                                                        fontStyle: 'normal',
                                                        fontWeight: '700',
                                                        lineHeight: 'normal',
                                                        wordBreak: "break-word",



                                                    }} />
                                                </ListItemButton>
                                            </ListItem>
                                        )
                                    })}


                                    <ListItem disablePadding>
                                        <ListItemButton onClick={handleCreateBoard}>
                                            <img src={require('../images/createboard-icon.svg').default} style={{ marginRight: "16px" }} />
                                            <ListItemText primary="+ Create New Board" disableTypography sx={{
                                                color: ' var(--main-purple, #635FC7)',
                                                fontSize: '15px',
                                                fontFamily: 'Plus Jakarta Sans',
                                                fontStyle: 'normal',
                                                fontWeight: '700',
                                                lineHeight: 'normal',
                                            }} />
                                        </ListItemButton>
                                    </ListItem>
                                </List>


                                <Box sx={{display:"flex", justifyContent:'center'}}>

                                    <Fab
                                        variant="extended"
                                        aria-label="add"
                                        sx={{
                                            // width: '30%',
                                            backgroundColor: mode === 'light-mode' ? '#f4f7fd' : '#20212C',
                                            ":hover": {
                                                backgroundColor: mode === 'light-mode' ? 'f4f7fd' : '#20212C',
                                            },
                                            alignSelf: 'center',
                                            borderRadius: '5px ',
                                            boxShadow: "none",
                                            display: "inline-flex",
                                            justifyContent: "center",
                                            gap: '15px',
                                            px: '60px'
                                        }}
                                    >
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <img src={require('../images/lightmode_icon.svg').default} style={{paddingRight:'10px'}} />
                                            <AntSwitch inputProps={{ 'aria-label': 'ant design' }} onClick={(e) => handleMode(e)} />
                                            <img src={require('../images/darkmode_icon.svg').default}  style={{paddingLeft:'10px'}}/>
                                        </Stack>
                                    </Fab>
                                </Box>
                            </StyledMenu>
                        </Box>

                    </div>



                    <Box sx={{ display: { xs: "flex", md: "none" }, flexWrap: 'nowrap' }}>
                        <Button onClick={toggleAddTask} sx={{
                            borderRadius: '24px',
                            background: 'var(--main-purple, #635FC7)',
                            width: 'auto',
                            height: '48px',

                            textTransform: 'none',
                            "&.Mui-disabled": {
                                background: mode === 'light-mode' ? "#d8d7f1" : "#635FC7",
                                opacity: 0.25,
                            }
                        }}
                            disabled={!isListsRetrived ? true : false}>
                            <img src={require("../images/plus.svg").default} />
                        </Button>

                        <Button
                            id="demo-customized-button"
                            aria-controls={openAnchor ? 'demo-customized-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={openAnchor ? 'true' : undefined}
                            disableElevation
                            onClick={handleClick}
                            sx={{
                                color: '#828FA3'
                            }}
                            startIcon={<MoreVertIcon />}
                        >
                        </Button>
                        <StyledMenu

                            id="demo-customized-menu"
                            MenuListProps={{
                                'aria-labelledby': 'demo-customized-button',
                            }}
                            sx={{
                                "& ul": {
                                    backgroundColor: mode === 'dark-mode' ? "#20212C" : "",

                                },


                            }}

                            anchorEl={anchorEl}
                            open={openAnchor}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleEditBoard} disableRipple sx={{
                                color: "#828FA3"
                            }}>
                                Edit Board
                            </MenuItem>
                            <MenuItem onClick={handleDeleteBoard} disableRipple sx={{ color: '#EA5555' }}>
                                Delete Board
                            </MenuItem>

                        </StyledMenu>
                    </Box>




                    <Box sx={{ display: { xs: 'none', md: "block" }, flexWrap: 'nowrap' }}>
                        <Button onClick={toggleAddTask} sx={{
                            borderRadius: '24px',
                            background: 'var(--main-purple, #635FC7)',
                            width: '164px',
                            height: '48px',

                            textTransform: 'none',
                            "&.Mui-disabled": {
                                background: mode === 'light-mode' ? "#d8d7f1" : "#635FC7",
                                opacity: 0.25,
                            }
                        }}
                            disabled={!isListsRetrived ? true : false}>
                            <span className="text-heading-M">+ Add New Task</span>
                        </Button>

                        <Button
                            id="demo-customized-button"
                            aria-controls={openAnchor ? 'demo-customized-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={openAnchor ? 'true' : undefined}
                            disableElevation
                            onClick={handleClick}
                            sx={{
                                color: '#828FA3'
                            }}
                        >
                            <MoreVertIcon />
                        </Button>
                        <StyledMenu

                            id="demo-customized-menu"
                            MenuListProps={{
                                'aria-labelledby': 'demo-customized-button',
                            }}
                            sx={{
                                "& ul": {
                                    backgroundColor: mode === 'dark-mode' ? "#20212C" : "",

                                },


                            }}

                            anchorEl={anchorEl}
                            open={openAnchor}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleEditBoard} disableRipple sx={{
                                color: "#828FA3"
                            }}>
                                Edit Board
                            </MenuItem>
                            <MenuItem onClick={handleDeleteBoard} disableRipple sx={{ color: '#EA5555' }}>
                                Delete Board
                            </MenuItem>

                        </StyledMenu>
                    </Box>




                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: mode === 'light-mode' ? 'var(--white, #fff)' : "var(--very-dark-grey-dark-bg, #2B2C37)",
                        borderColor: mode === 'dark-mode?' ? '#3E3F4E' : ""
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader sx={{ justifyContent: 'start' }}>
                    {mode === 'light-mode' ? <img src={require('../images/logo.svg').default} style={{ ...(!open && { display: 'none' }), marginLeft: '32px' }} />
                        : <img src={require('../images/logo_dark_mode.svg').default} style={{ ...(!open && { display: 'none' }), marginLeft: '32px' }} />}
                </DrawerHeader>

                <List>
                    <p className='sidebar-small-text'>
                        ALL BOARDS
                    </p>
                    {boards.AllBoards.map((board, index) => {

                        const isSelected = selectedBoard.length ? board.id === selectedBoard[0].id ? true : false : false;
                        return (

                            <ListItem key={index} disablePadding>
                                <ListItemButton onClick={() => setSelectedBoard(board)}
                                    sx={{
                                        backgroundColor: isSelected ? 'var(--main-purple, #635FC7)' : "ffffff",
                                        borderRadius: '0px 100px 100px 0px',
                                        maxWidth: '90%',

                                        '&:hover': {
                                            backgroundColor: '#f0effa',
                                            '& .hoveredColor': {
                                                color: 'var(--main-purple, #635FC7)'
                                            }
                                        }

                                    }} >
                                    <img src={require('../images/board-icon.svg').default} style={{ marginRight: "16px" }} />
                                    <ListItemText disableTypography primary={board.name} className='hoveredColor' sx={{
                                        color: isSelected ? 'white' : 'var(--medium-grey, #828FA3)',
                                        fontSize: '15px',
                                        fontFamily: 'Plus Jakarta Sans',
                                        fontStyle: 'normal',
                                        fontWeight: '700',
                                        lineHeight: 'normal',
                                        wordBreak: "break-word",



                                    }} />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}


                    <ListItem disablePadding>
                        <ListItemButton onClick={handleCreateBoard}>
                            <img src={require('../images/createboard-icon.svg').default} style={{ marginRight: "16px" }} />
                            <ListItemText primary="+ Create New Board" disableTypography sx={{
                                color: ' var(--main-purple, #635FC7)',
                                fontSize: '15px',
                                fontFamily: 'Plus Jakarta Sans',
                                fontStyle: 'normal',
                                fontWeight: '700',
                                lineHeight: 'normal',
                            }} />
                        </ListItemButton>
                    </ListItem>
                </List>


                <Fab
                    variant="extended"
                    aria-label="add"
                    sx={{
                        ...toggleModeBtn,
                        // width: '30%',
                        backgroundColor: mode === 'light-mode' ? '#f4f7fd' : '#20212C',
                        ":hover": {
                            backgroundColor: mode === 'light-mode' ? 'f4f7fd' : '#20212C',
                        },
                        alignSelf: 'center',
                        borderRadius: '5px ',
                        boxShadow: "none",
                        display: "inline-flex",
                        justifyContent: "center",
                        gap: '15px',
                        px: '60px'
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <img src={require('../images/lightmode_icon.svg').default} />
                        <AntSwitch inputProps={{ 'aria-label': 'ant design' }} onClick={(e) => handleMode(e)} />
                        <img src={require('../images/darkmode_icon.svg').default} />
                    </Stack>
                </Fab>

                <Fab onClick={handleDrawerClose}
                    variant="extended"
                    aria-label="add"
                    sx={{
                        backgroundColor: mode === 'light-mode' ? 'white' : '#2B2C37',

                        boxShadow: "none",
                        ...hideSideBarBtn,
                        display: "inline-flex",
                        justifyContent: "center",
                        gap: '15px',
                        pr: '70px',
                        pl: '40px'
                    }}
                >
                    <img src={require('../images/hide-sidebar.svg').default} alt="" />
                    <p className='sidebar-text'>Hide Sidebar</p>
                </Fab>

            </Drawer>
            <Main open={open} sx={{ width: '100%' }}>
                <DrawerHeader />
                {children}
            </Main>





            <Fab sx={{
                ...floatActionBtn,
                backgroundColor: "#635FC7",
                display: { xs: "none", sm: "block" },
                width: ' 3.5rem',
                height: '3rem',
                ':hover': {
                    backgroundColor: '#A8A4FF'
                },
                ...(open && { display: 'none' })
            }}
                variant="extended"
                size="small"
                onClick={handleDrawerOpen}
                color="primary"
                aria-label="open drawer">

                <img src={require('../images/eye.svg').default} />
            </Fab>

        </Box>
    );
}