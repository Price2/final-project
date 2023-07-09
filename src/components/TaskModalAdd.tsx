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
import { AddBoard, UpdateBoard, createBoard, createCard, createListForBoard, deleteBoardList, fetchBoardById, fetchSelectedBoard, incrementBoardColumnSize, updateBoardList, updateBoardName } from '../features/boardSlice';
import { toggleAddTasks, toggleCreateBoard, toggleEditBoard } from '../features/modalSlice';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { MenuItem, Slide } from '@mui/material';
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
    const selectedBoard = useSelector((state: RootState) => state.boards.selectedBoard);
    const modalToggle = useSelector((state: RootState) => state.modals);
    const selectedCard = useSelector((state: RootState) => state.boards.selectedBoardCard);
    const mode = useSelector((state: RootState) => state.mode.mode);

    const dispatch: AppDispatch = useAppDispatch();
    const form = useForm<FormValues>({
        defaultValues: {
            title: "",
            description: "",
            status: selectedBoard.length ? selectedBoard[0].lists[0] : ""

        }
    });
    const { control, handleSubmit, reset, getValues, setValue, formState } = form;


    React.useEffect(() => {
        if (modalToggle.addTasksToggle) {
            setOpen(true)
        }

    }, [modalToggle.addTasksToggle])




    const handleClose = () => {
        setOpen(false);
        reset({
            title: "",
            status: "",
            description: ""
        })
        dispatch(toggleAddTasks(false))

    };


    const onSubmit = (data: any) => {

        setOpen(false);
        const createNewCard = async () => {
            debugger;
            await dispatch(createCard({ card_name: data.title, list_id: data.status, card_desc: data.description }))
            dispatch(toggleAddTasks(false))
            await dispatch(fetchSelectedBoard(selectedBoard[0].id))
        }
        createNewCard();
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
            <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
                <form onSubmit={handleSubmit(onSubmit)} style={{
                    padding: "50px 20px",
                    backgroundColor: mode === 'dark-mode' ? "#2B2C37" : ""
                }}>

                    <DialogTitle sx={{
                        color: mode === 'dark-mode' ? "white" : ' var(--black, #000112)',
                        fontSize: '18px',
                        fontFamily: ' Plus Jakarta Sans',
                        fontStyle: 'normal',
                        fontWeight: '700',
                        lineHeight: 'normal',

                    }}>Add New Task</DialogTitle>
                    <DialogContent>

                        <Controller
                            control={control}
                            name="title"
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                <div>
                                    <InputLabel shrink htmlFor="bootstrap-input" sx={{
                                        color: mode === 'dark-mode' ? "white" : ' var(--medium-grey, #828FA3)',
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
                                            "& input::placeholder": {
                                                color: mode === 'dark-mode' ? "white" : ""
                                            },
                                            ' .MuiInputBase-input': {
                                                color: mode==='dark-mode'?'white':""
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
                                        color: mode === 'dark-mode' ? "white" : ' var(--medium-grey, #828FA3)',
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
                                            mb: "65px",
                                            padding: "0px",
                                            "& input::placeholder": {
                                                color: mode === 'dark-mode' ? "white" : ""
                                            },

                                            ' .MuiInputBase-input': {
                                                color: mode==='dark-mode'?'white':""
                                            },

                                        }}


                                    />

                                </div>
                            )}
                        />



                        <InputLabel shrink htmlFor="bootstrap-input" sx={{
                            color: mode === 'dark-mode' ? "white" : ' var(--medium-grey, #828FA3)',
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
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {selectedBoard[0].lists.map((list: any, idx: any) => {

                                            return (<MenuItem key={idx} value={list.id}>{list.name}</MenuItem>)

                                        })}
                                    </Select>
                                    <FormHelperText sx={{color:'#d32f2f'}}>{!value ? "Required" : ""}</FormHelperText>
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
                                ":hover": {
                                    backgroundColor: 'var(--main-purple-hover, #A8A4FF)'
                                }
                            }}
                            type="submit"><span className='btn-text' style={{ color: "white" }}>Create Task</span></Button>

                    </DialogActions>
                </form >
            </Dialog >

            <DevTool control={control} />
        </>
    );
}