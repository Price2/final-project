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


    console.log("selectedBoard ", selectedBoard);

    return (
        <div style={{ width: '100%', display: "flex", flexWrap: "nowrap" }}>


            <>
                {selectedBoard.length && selectedBoard[0]?.lists?.length ?
                    <>
                        {selectedBoardList.map((board: any, idx: string) => {

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
                                    }}
                                >
                                    <div>

                                        <p style={{ display: "flex", alignItems: 'center',  fontSize: '12px',
                                                fontStyle: 'normal',
                                                fontWeight: '700',
                                                lineHeight: 'normal',
                                                letterSpacing: '2.4px',
                                                color: 'var(--medium-grey, #828FA3)', }}>
                                            <span style={{
                                                width: 15,
                                                height: 15,
                                                backgroundColor: `${getRandomColor()}`,
                                                borderRadius: '50%',
                                                marginRight: '12px',
                                        

                                            }} /> {board.name} ({selectedBoardList.length})</p>
                                        <Card sx={{
                                            minWidth: 275, width: '300px', height: "90px", boxShadow: '0px 4px 6px 0px rgba(54, 78, 126, 0.10)',
                                            borderRadius: '8px',

                                        }}>
                                            <CardContent>
                                                <Typography sx={{ fontSize: 14, }} color="text.secondary" gutterBottom>
                                                    Word of the Day
                                                </Typography>

                                            </CardContent>

                                        </Card>

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

                                <Card sx={{
                                    minWidth: 275,
                                    width: '280px',
                                    height: "100vh",
                                    marginTop: "55px",
                                    cursor: "pointer",
                                    backgroundColor: "#E9EFFA",


                                }} className="test">
                                    <CardContent sx={{
                                        position: 'relative',
                                    }}>
                                        <p className="create-column-text testalso" >
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
                            <Button sx={{
                                borderRadius: '24px',
                                background: 'var(--main-purple, #635FC7)',
                                width: '185px',
                                height: '48px',
                                textTransform: 'none',

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