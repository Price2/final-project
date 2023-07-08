import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AppDispatch, RootState, useAppDispatch } from '../app/store';
import { useSelector } from 'react-redux';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import { deleteBoard, deleteCard, fetchBoards, fetchSelectedBoard } from '../features/boardSlice';
import { toggleDeleteBoard, toggleDeleteTasks, toggleEditTasks, toggleViewTasks } from '../features/modalSlice';



const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function AlertDialog() {
    const [open, setOpen] = React.useState(false);
    const dispatch: AppDispatch = useAppDispatch();
    const modalToggle = useSelector((state: RootState) => state.modals);
    const selectedBoard = useSelector((state: RootState) => state.boards.selectedBoard);
    const selectedCard = useSelector((state: RootState) => state.boards.selectedBoardCard);

    React.useEffect(() => {
        if (modalToggle.deleteTasksToggle) {
            dispatch(toggleEditTasks(false))
            dispatch(toggleViewTasks(false))
            setOpen(true);
        }
    }, [modalToggle.deleteTasksToggle])




    const handleClose = () => {
        setOpen(false);
        dispatch(toggleDeleteTasks(false))
        dispatch(toggleEditTasks(true))
    };

    const confirmDeleteTask = () => {

        const cardDel = async () => {
            dispatch(toggleEditTasks(false))
            dispatch(toggleViewTasks(false))
            dispatch(toggleDeleteTasks(false))
            await dispatch(deleteCard(selectedCard[0].id))
            await dispatch(fetchSelectedBoard(selectedBoard[0].id))
        }
        cardDel()
        setOpen(false)
    }

    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                sx={{
                    maxHeight: 'calc(100% - 200px)',
                    borderRadius: '6px',

                }}
            >
                <DialogTitle id="alert-dialog-title"
                    sx={{
                        color: ' var(--red, #EA5555)',
                        fontFamily: 'Plus Jakarta Sans',
                        fontSize: '18px',
                        fontStyle: 'normal',
                        fontWeight: '700',
                        lineHeight: 'normal',
                        padding: '32px 50px'
                    }}
                >
                    Delete this Task?
                </DialogTitle>
                <DialogContent sx={{ padding: '32px 50px' }}>
                    <DialogContentText id="alert-dialog-description" sx={{
                        color: 'var(--medium-grey, #828FA3)',
                        fontFamily: 'Plus Jakarta Sans',
                        fontSize: '13px',
                        fontStyle: 'normal',
                        fontWeight: '500',
                        lineHeight: '23px',
                    }}>
                    Are you sure you want to delete the ‘Build settings UI’ task and its subtasks? This action cannot be reversed.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center', gap: "40px", paddingBottom: "40px" }}>
                    <Button sx={{
                        borderRadius: '20px',
                        background: 'var(--red, #EA5555)',
                        width: '226px',
                        height: '42px',
                        '&:hover': {
                            backgroundColor: ' var(--red-hover, #FF9898);',
                        }
                    }} onClick={confirmDeleteTask}><span style={{
                        color: 'var(--white, #FFF)',
                        textAlign: 'center',
                        fontFamily: 'Plus Jakarta Sans',
                        fontSize: '13px',
                        fontStyle: 'normal',
                        fontWeight: '700',
                        lineHeight: '23px',

                    }}>Delete</span></Button>
                    <Button sx={{
                        width: '226px',
                        height: '42px',
                        borderRadius: '20px',
                        background: 'rgba(99, 95, 199, 0.10)',
                        '&:hover': {
                            backgroundColor: 'rgba(99, 95, 199, 0.25)',
                    }
                    }} onClick={handleClose} autoFocus>
                    <span style={{
                        color: 'var(--main-purple, #635FC7)',
                        textAlign: 'center',
                        fontFamily: 'Plus Jakarta Sans',
                        fontSize: '13px',
                        fontStyle: 'normal',
                        fontWeight: '700',
                        lineHeight: '23px',
                    }}>Cancel</span>
                </Button>
            </DialogActions>
        </Dialog>
        </div >
    );
}
