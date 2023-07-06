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
import { AddBoard, UpdateBoard, createBoard, createListForBoard, deleteBoardList, fetchBoardById, fetchSelectedBoard, incrementBoardColumnSize, updateBoardList, updateBoardName } from '../features/boardSlice';
import { toggleCreateBoard, toggleEditBoard } from '../features/modalSlice';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';



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



type FormValues = {
    board_name: string,
    listsName: {
        name: string,
    }[]
}


export default function ModalForm() {
    const form = useForm<FormValues>({
        defaultValues: {
            board_name: "",

        }
    });
    const { register, control, handleSubmit, reset, getValues, setValue, formState, watch } = form;
    const [open, setOpen] = React.useState(false);
    const [removedList, setRemovedList] = React.useState<any>([]);
    const boardList = useSelector((state: RootState) => state.boards.boardColumns);
    const selectedBoard = useSelector((state: RootState) => state.boards.selectedBoard);
    const modalToggle = useSelector((state: RootState) => state.modals);
    const dispatch: AppDispatch = useAppDispatch();

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray<FormValues>({
        control,
        name: "listsName",

    });
    console.log("board list ", boardList);

    React.useEffect(() => {
        console.log("im looking state fields ", formState)

    }, [formState.touchedFields])


    React.useEffect(() => {
        // debugger
        if (modalToggle.addNewBoardToggle) {
            setOpen(true)
        }

    }, [modalToggle.addNewBoardToggle])


    React.useEffect(() => {
        debugger;
        if (modalToggle.editBoardToggle) {
            if (selectedBoard.length && selectedBoard[0].lists.length) {
                const lists: any = []
                selectedBoard[0].lists.map((list: any) => {
                    lists.push({ name: list.name, id: list.id })
                    setValue('board_name', selectedBoard[0].name)
                    setValue('listsName', lists)

                })
                setOpen(true)
            }
            else {
                setOpen(true)
                setValue('board_name', selectedBoard[0].name)
            }
        }


    }, [modalToggle.editBoardToggle])

    const handleClose = () => {
        console.log("im closed? ", modalToggle)
        setOpen(false);
        reset({
            board_name: "",
            listsName: []
        })
        dispatch(toggleCreateBoard(false))
        if (modalToggle.editBoardToggle) {
            dispatch(toggleEditBoard(false))
        }
    };


    const onSubmit = (data: any) => {
        console.log("submitted ", data)
        const boardCreation = async () => {
            if (data.listsName.length) {
                const boardCreated = await dispatch(createBoard(data.board_name))
                const { id } = boardCreated.payload;
                for (const lists in data.listsName) {
                    console.log("names ", data.listsName[lists].name)
                    await dispatch(createListForBoard({ list_name: data.listsName[lists].name, board_id: id }))
                }
                const getBoardWithLists = await dispatch(fetchBoardById(id))
                dispatch(AddBoard(getBoardWithLists.payload))
            }
            else {
                const boardCreated = await dispatch(createBoard(data.board_name))
                dispatch(AddBoard(boardCreated.payload))
            }

        }

        if (modalToggle.editBoardToggle) {
            const updates_found = []
            debugger;
            boardUpdate(data)
            // for (const listToRemove in removedList) {
            //     const listname = selectedBoard[0].lists.filter((list: any) => list.name === removedList[listToRemove].name)[0]
            //     dispatch(deleteBoardList(listname.id))
            //     console.log("same name? ", listname)
            // }
            // console.log("updated ", data)



            // for (const key in data.listsName) {
            //     debugger;
            //     if (data.listsName[key]?.id) {
            //         dispatch(updateBoardList({ list_id: data.listsName[key].id, listName: data.listsName[key].name }))
            //     }
            //     else {
            //         dispatch(createListForBoard({list_name: data.listsName[key].name, board_id: selectedBoard[0].id}))
            //     }
            //     console.log("same name? ")
            // }


            // const reFetchBoard = async () => {
            //     debugger;
            //     const reFetchBoard: any = await dispatch(fetchSelectedBoard(selectedBoard[0].id))
            //     dispatch(UpdateBoard(reFetchBoard.payload))
            //     console.log("updated ", reFetchBoard)
            // }
            // reFetchBoard()


            console.log("Logging updates ")
            dispatch(toggleEditBoard(false))

        }
        else {
            boardCreation()
        }
        setOpen(false);
    }

    const boardUpdate = (data: any) => {
        
        if (modalToggle.editBoardToggle) {
            const updates_found = []
            debugger;

            if (data.board_name !== selectedBoard[0].name) {
                dispatch(updateBoardName({board_id: selectedBoard[0].id, board_name: data.board_name}))
            }
            for (const listToRemove in removedList) {
                const listname = selectedBoard[0].lists.filter((list: any) => list.name === removedList[listToRemove].name)[0]
                dispatch(deleteBoardList(listname.id))
                console.log("same name? ", listname)
            }
            console.log("updated ", data)



            for (const key in data.listsName) {
                debugger;
                if (data.listsName[key]?.id) {
                    dispatch(updateBoardList({ list_id: data.listsName[key].id, listName: data.listsName[key].name }))
                }
                else {
                    dispatch(createListForBoard({ list_name: data.listsName[key].name, board_id: selectedBoard[0].id }))
                }
                console.log("same name? ")
            }


            const reFetchBoard = async () => {
                debugger;
                const reFetchBoard: any = await dispatch(fetchSelectedBoard(selectedBoard[0].id))
                dispatch(UpdateBoard(reFetchBoard.payload))
                console.log("updated ", reFetchBoard)
            }
            reFetchBoard()
        }
    }

    React.useEffect(() => {
        reset({
            board_name: "",
            listsName: []
        })
    }, [formState.isSubmitSuccessful])
    console.log("Form state ", formState)
    console.log("logging modal ", modalToggle)


    const handleRemove = (field: any, idx: any) => {
        console.log("am i removed? ", field)
        setRemovedList((myprev: any) => [...myprev, field])
        remove(idx);
    }

    console.log("logging form removed ", removedList)
    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <DialogTitle sx={{
                        color: ' var(--black, #000112)',
                        fontSize: '18px',
                        fontFamily: ' Plus Jakarta Sans',
                        fontStyle: 'normal',
                        fontWeight: '700',
                        lineHeight: 'normal',
                    }}> {modalToggle.addNewBoardToggle ?
                        "Add New Board" : "Edit Board"
                        }</DialogTitle>
                    <DialogContent>
                        <Controller
                            control={control}
                            name="board_name"
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                <div>
                                    <InputLabel shrink htmlFor="bootstrap-input" sx={{
                                        color: ' var(--medium-grey, #828FA3)',
                                        fontSize: '16px',
                                        fontFamily: ' Plus Jakarta Sans',
                                        fontStyle: 'normal',
                                        fontWeight: '700',
                                        lineHeight: 'normal',
                                    }}>
                                        {modalToggle.editBoardToggle ? "Board Name" : "Name"}
                                    </InputLabel>


                                    <TextField
                                        placeholder="e.g. Web Design"
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
                                            padding: "0px"
                                        }}
                                    />
                                </div>
                            )}
                        />
                        <DialogContentText sx={{
                            color: 'var(--medium-grey, #828FA3)',
                            fontSize: '12px',
                            fontFamily: 'Plus Jakarta Sans',
                            fontStyle: 'normal',
                            fontWeight: '700',
                            lineHeight: 'normal',
                            mb: "8px"
                        }}>
                            {modalToggle.editBoardToggle ? "Board Columns" : "Columns"}
                        </DialogContentText>

                        {fields.map((field, idx) => {
                            return (
                                <div key={field.id}>

                                    <Controller
                                        control={control}
                                        name={`listsName.${idx}.name`}
                                        render={({ field: { onChange, onBlur, value, ref } }) => (
                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: "25px" }}>

                                                <TextField

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
                                                        width: "500px",
                                                        maxWidth: "100%",
                                                        height: '40px',
                                                        minWidth: '0',
                                                        // mb: "48px",
                                                        padding: "0px"
                                                    }}
                                                />
                                                <i onClick={() => { handleRemove(field, idx) }} style={{
                                                    cursor: "pointer",
                                                }}><img src={require("../images/col-x.svg").default} alt="" style={{ marginLeft: "20px" }} /></i>
                                            </div>
                                        )}
                                    />





                                </div>
                            )



                        })}
                    </DialogContent>
                    <DialogActions sx={{
                        display: 'flex', flexDirection: "column", alignItems: "center", justifyContent: "center",
                        padding: '20px 24px',

                    }}>
                        <Button sx={{
                            borderRadius: '20px',
                            backgroundColor: 'rgba(99, 95, 199, 0.10)',
                            width: '100%',
                            py: "10px",
                            mb: "24px"
                        }} onClick={() => append({ name: "" })}><span className='btn-text'>+ Add New Column</span></Button>

                        {modalToggle.editBoardToggle ?
                            <Button
                                sx={{
                                    borderRadius: '20px',
                                    backgroundColor: 'var(--main-purple, #635FC7)',
                                    width: '100%',
                                    py: "10px"
                                }}
                                type="submit"><span className='btn-text' style={{ color: "white" }}>Save Changes</span></Button>
                            :

                            <Button
                                sx={{
                                    borderRadius: '20px',
                                    backgroundColor: 'var(--main-purple, #635FC7)',
                                    width: '100%',
                                    py: "10px"
                                }}
                                type="submit"><span className='btn-text' style={{ color: "white" }}>Create New Board</span></Button>
                        }

                    </DialogActions>
                </form >
            </Dialog >

            <DevTool control={control} />
        </>
    );
}