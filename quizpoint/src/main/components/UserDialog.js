/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

import { user } from '../../firebase/fb.user'
import { useNavigate } from "react-router-dom"
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

/**========================================================================
 *                             User Dialog box
 *========================================================================**/
export default function UserDialog(props) {
    // navigate reference
    const navigate = useNavigate()
    // props passed through on element
    const { open, onClose } = props
    /**==============================================
     **              handleAction
     *?  What does it do? Handles action for user dialog list buttons
     *=============================================**/
    function handleAction(location) {
        // navigate to desired location
        navigate(location)
        // run on close event inputted through prop
        onClose()
    }
    return (
        // Dialog
        <Dialog fullWidth={true} maxWidth={'sm'} open={open} onClose={onClose}>
            <DialogTitle>{user.name}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleAction('user/local')}>
                                <ListItemIcon>
                                    <AssignmentIndOutlinedIcon></AssignmentIndOutlinedIcon>
                                </ListItemIcon>
                                <ListItemText primary="View Profile" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleAction('logout')}>
                                <ListItemIcon>
                                    <ExitToAppOutlinedIcon></ExitToAppOutlinedIcon>
                                </ListItemIcon>
                                <ListItemText primary="Log Out" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}