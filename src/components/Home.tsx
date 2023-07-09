import { useSelector } from "react-redux";
import { AppDispatch, RootState, useAppDispatch } from "../app/store";
import { shuffle } from "lodash";
import { Box, Button, Grid, Paper, styled } from "@mui/material";
import React from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import getRandomColor from "../helperfunctions/helperfunctions";
import { setCurrentSelectedCard } from "../features/boardSlice";
import { toggleEditBoard, toggleViewTasks } from "../features/modalSlice";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


export default function Home() {
    const selectedBoard = useSelector((state: RootState) => state.boards.selectedBoard);
    const selectedBoardList = selectedBoard.length ? selectedBoard[0].lists : [];
    const dispatch: AppDispatch = useAppDispatch();
    const mode = useSelector((state: RootState) => state.mode.mode);


    console.log("selectedBoard ", selectedBoardList);


    const handleToggleViewCard = (card: {}) => {
        console.log("card selected ", card)
        dispatch(setCurrentSelectedCard(card))
        dispatch(toggleViewTasks(true))
    }

    const toggleEditBaord = () => {
        dispatch(toggleEditBoard(true))

    }

    return (
        <div style={{
            width: '100%', display: "flex", flexWrap: "nowrap", position: 'relative', overflowX: "auto"

        }} className="gapInSmallWidth">


            <>
                {selectedBoard.length && selectedBoard[0]?.lists?.length ?
                    <>
                        {selectedBoardList.map((list: any, idx: string) => {

                            return (

                                <Box key={idx}
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        flexDirection: 'column',
                                        alignContent: 'flex-start',
                                        p: 1,
                                        m: 1,
                                        height: 200,
                                        borderRadius: 1,
                                        maxWidth: '20%',
                                        flex: 1, flexShrink: 0, flexBasis: 0,
                                    }}
                                >
                                    <div>

                                        <p style={{
                                            display: "flex", alignItems: 'center', fontSize: '12px',
                                            fontStyle: 'normal',
                                            fontWeight: '700',
                                            lineHeight: 'normal',
                                            letterSpacing: '2.4px',
                                            color: 'var(--medium-grey, #828FA3)',
                                            marginBottom: '24px',
                                        }}>
                                            <span style={{
                                                width: 15,
                                                height: 15,
                                                backgroundColor: `${getRandomColor()}`,
                                                borderRadius: '50%',
                                                marginRight: '12px',


                                            }} /> {list.name} ({((list: any) => {
                                                const cards = selectedBoard[0].cards.filter((card: any) => {
                                                    if (card.idList === list.id) {
                                                      return true
                                                    }
                                                    return false
                                                }
                                                )
                                                return <>{cards.length? cards.length: "0"}</>
                                            }
                                            )
                                            (list)}
                                            )</p>

                                        {selectedBoard[0].cards.map((card: any, idx: string) => {

                                            return card.idList === list.id ?
                                                <Card key={idx} onClick={() => handleToggleViewCard(card)} sx={{
                                                    minWidth: "auto", width: '300px', height: "90px",
                                                    borderRadius: '8px',
                                                    mb: '20px',
                                                    cursor: 'pointer',
                                                    boxShadow: '0px 4px 6px 0px rgba(54, 78, 126, 0.10)',
                                                    backgroundColor: mode === 'dark-mode' ? "#2B2C37" : "",
                                                    "&:hover": {
                                                        "& .cardNameHover": {
                                                            color: '#635FC7'
                                                        }
                                                    }
                                                }}>
                                                    <CardContent>
                                                        <Typography sx={{
                                                            color: mode === 'light-mode' ? 'var(--black, #000112)' : "white",
                                                            fontFamily: 'Plus Jakarta Sans',
                                                            fontSize: '15px',
                                                            fontStyle: 'normal',
                                                            fontWeight: '700',
                                                            lineHeight: 'normal',


                                                        }} color="text.secondary" gutterBottom className="cardNameHover">
                                                            {card.name}
                                                        </Typography>

                                                    </CardContent>

                                                </Card> : ""

                                        })}

                                    </div>
                                </Box>
                            )
                        })}

                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                flexDirection: 'column',
                                alignContent: 'flex-start',
                                p: 1,
                                m: 1,
                                // height: '100vh',
                                borderRadius: 1,
                            }}
                        >
                            <div>

                                <Card onClick={toggleEditBaord} sx={{
                                    minWidth: 275,
                                    width: '280px',
                                    height: "100vh",
                                    marginTop: "45px",
                                    cursor: "pointer",
                                    background: mode === 'light-mode' ? "#E9EFFA" : "linear-gradient(180deg, rgba(43, 44, 55, 0.25) 0%, rgba(43, 44, 55, 0.13) 100%)",
                                    "&:hover": {
                                        "& .create-column-text": {
                                            color: ' var(--main-purple, #635FC7);'
                                        }
                                    },
                                }}>
                                    <CardContent sx={{
                                        position: 'relative',
                                    }}>
                                        <p className="create-column-text" >
                                            + New Column
                                        </p>

                                    </CardContent>

                                </Card>

                            </div>
                        </Box>
                    </>



                    : <>
                        <div style={{
                            display: "flex", flexDirection: 'column', alignItems: "center",
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}>

                            <p style={{
                                color: 'var(--medium-grey, #828FA3)',
                                textAlign: 'center',
                                fontSize: '18px',
                                fontFamily: 'Plus Jakarta Sans',
                                fontStyle: 'normal',
                                fontWeight: '700',
                                lineHeight: 'normal',
                            }}>This board is empty. Create a new column to get started.</p>
                            <Button onClick={toggleEditBaord} sx={{
                                borderRadius: '24px',
                                background: 'var(--main-purple, #635FC7)',
                                width: '185px',
                                height: '48px',
                                textTransform: 'none',
                                ':hover': {
                                    backgroundColor: '#A8A4FF'
                                }

                            }}>
                                <span className="text-heading-M">+ Add New Column</span>
                            </Button>
                        </div>

                    </>
                }
            </>
        </div >

    )
}