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

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Fab from '@mui/material/Fab';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState, useAppDispatch } from '../app/store';
import BoardModal from './BoardModal';
import { toggleCreateBoard, toggleEditBoard } from '../features/modalSlice';
import { fetchSelectedBoard, setCurrentSelectedBoard } from '../features/boardSlice';

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


type Props = {
    children: React.ReactNode;
  }

export default function PersistentDrawerLeft({children}: Props) {
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openAnchor = Boolean(anchorEl);
    const boards = useSelector((state: RootState) => state.boards);
    const selectedBoard = useSelector((state: RootState) => state.boards.selectedBoard);
    const isModalToggled = useSelector((state: RootState) => state.modals);
    const dispatch: AppDispatch = useAppDispatch();

    console.log("loading boards ", boards)


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
        dispatch(setCurrentSelectedBoard(board))
        
    }

    const handleEditBoard = () => {
        dispatch(toggleEditBoard(true))
    }


    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar sx={{ backgroundColor: 'var(--white, #fff)', }} position="fixed" open={open}>
                <Toolbar sx={{
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: "flex" }}>
                        <img src={require('../images/logo.svg').default} style={{ ...(open && { display: 'none' }) }} />
                        <Divider orientation="vertical" flexItem sx={{ height: "68px", mx: '32px', ...(open && { display: 'none' }) }} />

                        <h6 className="logo-header-text">
                            Platform Launch
                        </h6>
                    </div>

                    <div>
                        <Button sx={{
                            borderRadius: '24px',
                            background: 'var(--main-purple, #635FC7)',
                            width: '164px',
                            height: '48px',
                            textTransform: 'none',
                            "&.Mui-disabled": {
                                background: "#d8d7f1",
                              }
                        }}
                            disabled={!boards.AllBoards.length ? true : false}>
                            <span className="text-heading-M">+ Add New Task</span>
                        </Button>

                        <Button
                            id="demo-customized-button"
                            aria-controls={openAnchor ? 'demo-customized-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={openAnchor ? 'true' : undefined}
                            disableElevation
                            onClick={handleClick}
                        >
                            <MoreVertIcon />
                        </Button>
                        <StyledMenu
                            id="demo-customized-menu"
                            MenuListProps={{
                                'aria-labelledby': 'demo-customized-button',
                            }}
                            anchorEl={anchorEl}
                            open={openAnchor}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleEditBoard} disableRipple>
                                Edit Board
                            </MenuItem>
                            <MenuItem onClick={handleClose} disableRipple sx={{ color: 'red' }}>
                                Delete Board
                            </MenuItem>

                        </StyledMenu>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader sx={{ justifyContent: 'start' }}>
                    <img src={require('../images/logo.svg').default} style={{ ...(!open && { display: 'none' }), marginLeft: '32px' }} />
                </DrawerHeader>

                <List>
                    <p className='sidebar-small-text'>
                        ALL BOARDS
                    </p>
                    {boards.AllBoards.map((board, index) => {
                        
                        const isSelected = selectedBoard.length? board.id === selectedBoard[0].id? true : false : false;
                        return (

                            <ListItem key={index} disablePadding>
                                <ListItemButton onClick={() => setSelectedBoard(board)}
                                    sx={{
                                        backgroundColor: isSelected ? 'var(--main-purple, #635FC7)' : "ffffff",
                                        borderRadius: '0px 100px 100px 0px',
                                        maxWidth: '90%',
                                    }}>
                                    <img src={require('../images/board-icon.svg').default} style={{ marginRight: "16px" }} />
                                    <ListItemText disableTypography primary={board.name} sx={{
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


                <Fab onClick={handleDrawerClose}
                    variant="extended"
                    aria-label="add"
                    sx={{
                        backgroundColor: "white",
                        boxShadow: "none",
                        ...hideSideBarBtn,
                        display: "inline-flex",
                        justifyContent: "center",
                        gap: '15px',
                        px: '31px'
                    }}
                >
                    <img src={require('../images/hide-sidebar.svg').default} alt="" />
                    <p className='sidebar-text'>Hide Sidebar</p>
                </Fab>

            </Drawer>
            <Main open={open}>
                <DrawerHeader />
                {children}
            </Main>





            <Fab sx={{
                ...floatActionBtn,
                backgroundColor: "#635FC7",
                width: ' 3.5rem',
                height: '3rem',
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