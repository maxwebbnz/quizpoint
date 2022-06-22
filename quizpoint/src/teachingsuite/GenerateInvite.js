/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
// import { useParams, useNavigate } from "react-router-dom"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from "react";
import Button from '@mui/material/Button';

export default function GenerateInvite(props) {
    const [openDialog, setDialog] = useState(false)
    let inviteLink = `https://quizpoint.hvhs.school.nz/invite/${props.classId}`

    function generateInviteLink() {
        console.log(inviteLink)
    }


    return (
        <>
            <Dialog
                open={openDialog}
                fullWidth={true}
                maxWidth={'md'}
                onClose={() => setDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Invite Link for " + props.classObject.className}
                </DialogTitle>
                <DialogContent>
                    <a href={inviteLink}><h3>{inviteLink}</h3>  </a>

                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setDialog(false)}>Ka pai</Button>
                </DialogActions>
            </Dialog >

            <Button onClick={() => setDialog(true)}>Invite Link</Button>
        </>
    )
}