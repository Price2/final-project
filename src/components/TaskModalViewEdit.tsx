import * as React from 'react';
import { v4 as uuid } from 'uuid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InputBase from '@mui/material/InputBase';
import { alpha } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { DevTool } from '@hookform/devtools';
import DialogContentText from '@mui/material/DialogContentText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ReactDatePicker from "react-datepicker"
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { useAppDispatch, AppDispatch } from '../app/store';
import { AddBoard, UpdateBoard, createBoard, createListForBoard, deleteBoardList, deleteCard, fetchBoardById, fetchSelectedBoard, getCardList, incrementBoardColumnSize, updateBoardList, updateBoardName, updateCard } from '../features/boardSlice';
import { toggleAddTasks, toggleCreateBoard, toggleDeleteTasks, toggleEditBoard, toggleEditTasks, toggleViewTasks } from '../features/modalSlice';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Menu, MenuItem, Select, Slide } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { TransitionProps } from '@mui/material/transitions';



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3)
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.mode === 'light' ? '#F3F6F9' : '#1A2027',
        border: '1px solid',
        borderColor: theme.palette.mode === 'light' ? '#E0E3E7' : '#2D3843',
        fontSize: 16,
        width: 500,
        maxWidth: '100%',
        padding: '10px 12px',
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
        },
    },
}));


function BootstrapDialogTitle(props: { [x: string]: any; children: any; onClose: any; }) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type FormValues = {
    title: string,
    description: string,
    status: string,

}


export default function ModalForm() {
    const [open, setOpen] = React.useState(false);
    const [removedList, setRemovedList] = React.useState<any>([]);
    const boardList = useSelector((state: RootState) => state.boards.boardColumns);
    const selectedBoard = useSelector((state: RootState) => state.boards.selectedBoard);
    const selectedCard = useSelector((state: RootState) => state.boards.selectedBoardCard);
    const modalToggle = useSelector((state: RootState) => state.modals);
    const mode = useSelector((state: RootState) => state.mode.mode);

    const dispatch: AppDispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openDropDown = Boolean(anchorEl);
    const form = useForm<FormValues>({
        defaultValues: {
            title: "",
            description: "",
            status: ""

        }
    });
    const { register, control, handleSubmit, reset, getValues, setValue, formState, watch } = form;



    const handleDropDownClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleDropDownClose = () => {
        setAnchorEl(null);
    };

    React.useEffect(() => {
        if (modalToggle.viewTasksToggle || modalToggle.editTasksToggle) {
            setOpen(true)
            const loadCardInfo = async () => {
                const cardList = await dispatch(getCardList(selectedCard[0].id))
                reset({ title: selectedCard[0].name, description: selectedCard[0].desc, status: cardList.payload.id })
            }
            loadCardInfo()
        }
    }, [modalToggle.viewTasksToggle, modalToggle.editTasksToggle])


    const handleEditTasks = () => {
        handleDropDownClose();
        dispatch(toggleEditTasks(true))
        dispatch(toggleViewTasks(false))
        const loadCardInfo = async () => {
            const cardList = await dispatch(getCardList(selectedCard[0].id))
            reset({ title: selectedCard[0].name, description: selectedCard[0].desc, status: cardList.payload.id })
        }
        loadCardInfo()
    }

    const handleDeleteTasks = () => {
        handleDropDownClose()
        dispatch(toggleDeleteTasks(true))
        setOpen(false)
        // setOpen(false)
        // dispatch(toggleEditTasks(false))
        // dispatch(toggleViewTasks(false))
        // const cardDel = async () => {
        //     await dispatch(deleteCard(selectedCard[0].id))
        //     await dispatch(fetchSelectedBoard(selectedBoard[0].id))
        // }
        // cardDel()
    }

    const handleClose = () => {
        setOpen(false);
        dispatch(toggleEditTasks(false))
        dispatch(toggleViewTasks(false))
        reset({
            title: "",
            status: "",
            description: ""
        })
    };


    const onSubmit = (data: any) => {
        setOpen(false)
        const updatingCardInfo = async () => {
            debugger;
            dispatch(toggleEditTasks(false))
            dispatch(toggleViewTasks(false))
            await dispatch(updateCard({ card_id: selectedCard[0].id, card_name: data.title, card_desc: data.description, list_id: data.status }))
            await dispatch(fetchSelectedBoard(selectedBoard[0].id))
        }
        updatingCardInfo()
    }


    React.useEffect(() => {
        reset({
            title: "",
            status: "",
            description: ""
        })
    }, [formState.isSubmitSuccessful])

    return (
        <>
            <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} keepMounted

            >

                {modalToggle.viewTasksToggle &&
                    <>
                        <form onSubmit={handleSubmit(onSubmit)} style={{
                            padding: '0px 10px', backgroundColor: mode === 'dark-mode' ? '#2B2C37' : ""
                        }}>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '1200px',
                                height: '100px',
                                maxWidth: 'calc(100%)'
                            }}>
                                <DialogTitle sx={{
                                    color: mode === 'light-mode' ? 'var(--black, #000112)' : "white",
                                    fontSize: '18px',
                                    fontFamily: ' Plus Jakarta Sans',
                                    fontStyle: 'normal',
                                    fontWeight: '700',
                                    lineHeight: 'normal',
                                    pt: 0,

                                }}>{selectedCard[0].name}</DialogTitle>
                                <div >
                                    <IconButton
                                        aria-label="more"
                                        id="long-button"
                                        aria-controls={openDropDown ? 'long-menu' : undefined}
                                        aria-expanded={openDropDown ? 'true' : undefined}
                                        aria-haspopup="true"
                                        onClick={handleDropDownClick}
                                        sx={{
                                            color: '#828FA3'
                                        }}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        id="long-menu"
                                        MenuListProps={{
                                            'aria-labelledby': 'long-button',
                                        }}
                                        anchorEl={anchorEl}
                                        open={openDropDown}
                                        onClose={handleDropDownClose}

                                    >
                                        <MenuItem onClick={handleEditTasks} sx={{
                                            color: 'var(--medium-grey, #828FA3)',
                                            fontFamily: 'Plus Jakarta Sans',
                                            fontSize: '13px',
                                            fontStyle: 'normal',
                                            fontWeight: '500',
                                            lineHeight: '23px',
                                        }}>
                                            Edit Task
                                        </MenuItem>
                                        <MenuItem onClick={handleDeleteTasks} sx={{
                                            color: 'var(--red, #EA5555)',
                                            fontFamily: 'Plus Jakarta Sans',
                                            fontSize: '13px',
                                            fontStyle: 'normal',
                                            fontWeight: '500',
                                            lineHeight: '23px',
                                        }}>
                                            Delete Task
                                        </MenuItem>
                                    </Menu>

                                </div>
                            </div>

                            <DialogContent sx={{ width: "100%", pt: '0' }}>
                                <DialogContentText sx={{
                                    color: 'var(--medium-grey, #828FA3)',
                                    /* Body (L) */
                                    fontFamily: 'Plus Jakarta Sans',
                                    fontSize: '13px',
                                    fontStyle: 'normal',
                                    fontWeight: '500',
                                    lineHeight: '23px',
                                    my: "10px",

                                }}>
                                    {selectedCard[0].desc}
                                </DialogContentText>
                                <div style={{ marginTop: '55px' }}>
                                    <InputLabel shrink htmlFor="bootstrap-input" sx={{
                                        color: mode === "dark-mode" ? "white" : ' var(--medium-grey, #828FA3)',
                                        fontSize: '16px',
                                        fontFamily: ' Plus Jakarta Sans',
                                        fontStyle: 'normal',
                                        fontWeight: '700',
                                        lineHeight: 'normal',
                                    }}>
                                        Status
                                    </InputLabel>
                                    <Controller
                                        control={control}
                                        name="status"
                                        render={({ field: { onChange, onBlur, value },
                                            fieldState: { invalid, isTouched, isDirty, error },
                                        }) => (
                                            <FormControl required sx={{ mt: 0, width: "100%", }}>
                                                <Select
                                                    labelId="user-group-required-label"
                                                    id="user-group-required"
                                                    size='small'
                                                    onBlur={onBlur}
                                                    error={!value}
                                                    onChange={({ target: { value } }) => onChange(value)}
                                                    value={value}
                                                    required
                                                    sx={{
                                                        color: mode === 'dark-mode' ? "white" : "",
                                                        '.MuiOutlinedInput-notchedOutline': {
                                                            borderColor: mode==='dark-mode'?'rgba(228, 219, 233, 0.25)':"",

                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: mode==='dark-mode'?'rgba(228, 219, 233, 0.25)':"",
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: mode==='dark-mode'?'rgba(228, 219, 233, 0.25)':"",
                                                        },
                                                        '.MuiSvgIcon-root ': {
                                                            fill: mode==='dark-mode'?"white !important":"",
                                                        },
                                                       
                                                        ' .MuiInputBase-input': {
                                                            color: mode==='dark-mode'?'white':""
                                                        },
                                                    }}

                                                >
                                                    {/* <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem> */}
                                                    {selectedBoard[0].lists.map((list: any, idx: any) => {

                                                        return (<MenuItem key={idx} value={list.id} sx={{
                                                
                                                        }}>{list.name}</MenuItem>)

                                                    })}
                                                </Select>
                                                <FormHelperText>{!value ? "Required" : ""}</FormHelperText>
                                            </FormControl>

                                        )}
                                    />
                                </div>
                            </DialogContent>
                        </form>
                    </>

                }
                {modalToggle.editTasksToggle &&
                    <>
                    <form onSubmit={handleSubmit(onSubmit)} style={{
                        backgroundColor: mode === 'dark-mode' ? '#2B2C37' : ""
                    }}>

                            <DialogTitle sx={{
                                color: mode==='dark-mode'? "white": ' var(--black, #000112)',
                                fontSize: '18px',
                                fontFamily: ' Plus Jakarta Sans',
                                fontStyle: 'normal',
                                fontWeight: '700',
                                lineHeight: 'normal',
                            }}>Edit Task</DialogTitle>

                            <DialogContent>
                                <Controller
                                    control={control}
                                    name="title"
                                    render={({ field: { onChange, onBlur, value, ref } }) => (
                                        <div>
                                            <InputLabel shrink htmlFor="bootstrap-input" sx={{
                                                color: mode==='dark-mode'? "white":' var(--medium-grey, #828FA3)',
                                                fontSize: '16px',
                                                fontFamily: ' Plus Jakarta Sans',
                                                fontStyle: 'normal',
                                                fontWeight: '700',
                                                lineHeight: 'normal',
                                            }}>
                                                Title
                                            </InputLabel>


                                            <TextField
                                                placeholder="e.g. Take coffee break"
                                                size="small"
                                                onBlur={onBlur}

                                                onChange={onChange}
                                                value={value}
                                                error={!value}
                                                type='text'
                                                id="fullname-input"
                                                helperText={!value ? "Required" : ""}
                                                required
                                                sx={{
                                                    width: "550px",
                                                    maxWidth: "100%",
                                                    height: '40px',
                                                    minWidth: '0',
                                                    mb: "48px",
                                                    padding: "0px",
                                                    ' .MuiInputBase-input': {
                                                        color: mode==='dark-mode'? 'white' :""
                                                    },
                                                    '.MuiOutlinedInput-notchedOutline': {
                                                        borderColor: mode==='dark-mode'?'rgba(228, 219, 233, 0.25)': "",

                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor:mode==='dark-mode'? 'rgba(228, 219, 233, 0.25)': "",
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor:mode==='dark-mode'? 'rgba(228, 219, 233, 0.25)':"",
                                                    },
                                                    '.MuiSvgIcon-root ': {
                                                        fill: mode==='dark-mode'?"white !important":"",
                                                    },
                                                }}
                                            />

                                        </div>
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="description"
                                    render={({ field: { onChange, onBlur, value, ref } }) => (
                                        <div>
                                            <InputLabel shrink htmlFor="bootstrap-input" sx={{
                                                color: mode==='dark-mode'? "white":' var(--medium-grey, #828FA3)',
                                                fontSize: '16px',
                                                fontFamily: ' Plus Jakarta Sans',
                                                fontStyle: 'normal',
                                                fontWeight: '700',
                                                lineHeight: 'normal',
                                                

                                            }}>
                                                Description
                                            </InputLabel>


                                            <TextField
                                                placeholder="e.g. It’s always good to take a break. This 15 minute break will 
                                        recharge the batteries a little."
                                                size="small"
                                                onBlur={onBlur}
                                                multiline
                                                rows={4}

                                                onChange={onChange}
                                                value={value}
                                                error={!value}
                                                type='text'
                                                id="fullname-input"
                                                helperText={!value ? "Required" : ""}
                                                required
                                                sx={{
                                                    width: "550px",
                                                    maxWidth: "100%",
                                                    height: '40px',
                                                    minWidth: '0',
                                                    mb: "120px",
                                                    padding: "0px",
                                                    ' .MuiInputBase-input': {
                                                        color: mode==='dark-mode'?'white':""
                                                    },
                                                    '.MuiOutlinedInput-notchedOutline': {
                                                        borderColor: mode==='dark-mode'?'rgba(228, 219, 233, 0.25)':"",

                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: mode==='dark-mode'?'rgba(228, 219, 233, 0.25)':"",
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: mode==='dark-mode'?'rgba(228, 219, 233, 0.25)':"",
                                                    },
                                                   
                                                }}
                                            />

                                        </div>
                                    )}
                                />
                                <InputLabel shrink htmlFor="bootstrap-input" sx={{
                                    color: mode==='dark-mode'? "white":' var(--medium-grey, #828FA3)',
                                    fontSize: '16px',
                                    fontFamily: ' Plus Jakarta Sans',
                                    fontStyle: 'normal',
                                    fontWeight: '700',
                                    lineHeight: 'normal',
                                }}>
                                    Status
                                </InputLabel>
                                <Controller
                                    control={control}
                                    name="status"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <FormControl required sx={{ mt: 0, width: "100%" }}>
                                            <Select
                                                sx={{
                                                    ' .MuiInputBase-input': {
                                                        color: mode==='dark-mode'?'white':""
                                                    },
                                                    '.MuiOutlinedInput-notchedOutline': {
                                                        borderColor: mode==='dark-mode'?'rgba(228, 219, 233, 0.25)':"",

                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: mode==='dark-mode'?'rgba(228, 219, 233, 0.25)':"",
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: mode==='dark-mode'?'rgba(228, 219, 233, 0.25)':"",
                                                    },
                                                    '.MuiSvgIcon-root ': {
                                                        fill: mode==='dark-mode'?"white !important":"",
                                                    },
                                                }}
                                                labelId="user-group-required-label"
                                                id="user-group-required"
                                                size='small'
                                                onBlur={onBlur}
                                                error={!value}
                                                onChange={({ target: { value } }) => onChange(value)}
                                                value={value}
                                                // helperText={!value ? "Required" : ""}

                                                required
                                            >
                                                {/* <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem> */}
                                                {selectedBoard[0].lists.map((list: any, idx: any) => {

                                                    return (<MenuItem key={idx} value={list.id}>{list.name}</MenuItem>)

                                                })}
                                            </Select>
                                            <FormHelperText>{!value ? "Required" : ""}</FormHelperText>
                                        </FormControl>

                                    )}
                                />

                            </DialogContent>

                            <DialogActions sx={{
                                display: 'flex', flexDirection: "column", alignItems: "center", justifyContent: "center",
                                padding: '20px 24px',

                            }}>

                                <Button
                                    sx={{
                                        borderRadius: '20px',
                                        backgroundColor: 'var(--main-purple, #635FC7)',
                                        width: '100%',
                                        py: "10px",
                                        '&:hover': {
                                            backgroundColor: ' var(--main-purple-hover, #A8A4FF)',
                                        }
                                    }}
                                    type="submit"><span className='btn-text' style={{ color: "white" }}>Save Changes</span></Button>

                            </DialogActions>
                        </form>
                    </>
                }


            </Dialog >

            <DevTool control={control} />
        </>
    );
}