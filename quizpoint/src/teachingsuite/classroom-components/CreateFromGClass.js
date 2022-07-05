/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */

/**======================
 **   React Imports
 *========================**/
import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"

/**======================
 **   Data service Imports
 *========================**/
import { user } from '../../firebase/fb.user'
import axios from 'axios'
import { ref, set, update } from "firebase/database";
import { db } from '../../services/firebase'

/**======================
 **   MUI Imports
 *========================**/
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Swal from 'sweetalert2';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
/**======================
 **   Stylesheet Imports
 *========================**/
import './GClassCards.css'


/**======================
 **   Transition Handler
 *? What does it do? Handles transition of dialog
 *========================**/
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



/**========================================================================
 **                           CreateGoogleClass
 *?  What does it do? Shows all teachers classes, and handles creation of those classes
 *@param props - props passed from parent
 *========================================================================**/
export default function CreateGoogleClass(props) {
    // navigate reference
    const navigate = useNavigate()
    // states
    let id = props.currentId
    // is dialog open?
    const [open, setOpen] = useState(false);
    // is loading?
    const [loading, setLoading] = useState(true)
    // store all classes fetched from API
    const [classes, setClasses] = useState([])
    // announcment open dialog
    const [annoucnmentOpen, setAnnouncment] = useState(false)
    // current class id
    const [classId, setClassId] = useState('')
    // error detection
    const [error, setError] = useState(false)

    // close dialog if not used anymore?
    const handleClose = () => {
        setOpen(false);
    };

    /**==============================================
     **              createClass
     *?  What does it do? Stores class object in database
     *@param _index - index of class in array
     *=============================================**/
    function createClass(_index) {
        // reference
        let classRef = classes[_index]
        // setup class object
        let classObject = {}

        console.log("Creating Class")
        // prepare object
        classObject.code = classRef.id
        classObject.gLink = classRef.alternateLink
        classObject.classCreator = user.name
        classObject.className = classRef.name
        classObject.description = classRef.descriptionHeading
        classObject.quizzes = false
        // store in database
        set(ref(db, 'schools/hvhs/classes/' + classRef.id), classObject);
        // then add class to teachers classes
        update(ref(db, 'schools/hvhs/users/' + user.uid + '/classes/' + classRef.id), {
            code: classRef.id
        });
        update(ref(db, 'schools/hvhs/classes/' + classRef.id + '/teachers'), {
            [user.uid]: user.uid
        });
        update(ref(db, 'schools/hvhs/classes/' + classRef.id + '/students'), {
            [user.uid]: user.uid
        });
        // set up class id reference
        setClassId(classRef.id)
        // if teacher has not made any classes any more (bug fix)
        update(ref(db, 'schools/hvhs/users/' + user.uid + '/classes/'), { notEnrolled: null });
        // echo
        console.log('Created!')
        // finished with dialog
        setOpen(false)
        // show announcment prompt
        setAnnouncment(true)
        // we now need to send out an announcment to the class

    }

    /**==============================================
     **              createAnnouncment
     *?  What does it do? Handles creation of announcments to class
     *=============================================**/
    function createAnnouncment() {
        // setup announcment object
        const data = {
            text: "You have been invited to a QuizPoint class, please join with the attachment below",
            materials: [
                {
                    link: {
                        url: "https://quizpointnz.netlify.app/invite/" + classId

                    }
                }
            ]
        };
        // send announcment with a HTTP post to the api
        axios.post('https://classroom.googleapis.com/v1/courses/' + classId + '/announcements?' + 'access_token=' + sessionStorage.authToken, data)
            .then((res) => {
                console.log(`Status: ${res.status}`);
                console.log('Body: ', res.data);
            }).catch((err) => {
                console.error(err);
            });
        // we are done here, navigate to class
        navigate('/class/' + classId)
    }

    function handleError() {
        console.log('Your auth token is expired')
    }
    /**======================
     **   useEffect hook, on loading state update
     *========================**/
    useEffect(() => {
        // if program is in a loading state
        if (loading) {
            // set a reference to auth tokens

            // load all teachers classes
            var xhr = new XMLHttpRequest();
            // we want a object back please
            xhr.responseType = 'json';
            if (sessionStorage.authToken === undefined) {
                console.log("No auth token")
                setLoading(false)
            }
            // send a get request to classroom.googleapis.com API
            xhr.open('GET',
                'https://classroom.googleapis.com/v1/courses?' +
                'access_token=' + sessionStorage.authToken);
            // on load
            xhr.addEventListener('error', handleError);

            axios.get('https://classroom.googleapis.com/v1/courses?access_token=' + sessionStorage.authToken)
                .then(function (response) {
                    console.log(response.data);
                    // no need to do anything if response is null
                    //! pretty sure this code is irrelevant
                    if (response === null) {

                    }
                    // setup base array
                    let classesToShow = []
                    // for all courses
                    for (var indexOfCards = 0; indexOfCards < response.data.courses.length; indexOfCards++) {
                        // if course is active,
                        if (response.data.courses[indexOfCards].courseState === 'ACTIVE') {
                            // add to array
                            classesToShow.push(response.data.courses[indexOfCards])
                        } else {
                            // if not active, do nothing
                            //! this operation is not needed, time wasting..
                            response.data.courses.splice(indexOfCards, 1)

                        }
                    }
                    // add to state
                    setClasses(classesToShow)
                    // finished loading information
                    setLoading(false)
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                    // 401 is an authentication error (commonly auth token)
                    if (error.response.status === 401) {
                        // error handle
                        Swal.fire({
                            icon: 'error',
                            title: 'Error ' + error.response.status,
                            text: 'You need to re-authenticate',
                            confirmButtonText: 'Okay',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // we will perform a quick little unauthentication trick
                                navigate('/tcs/globalreauth/classes,create,' + id)

                                // and then redirect the user to the login page (while maintaing the route)
                                // should be sweet
                            } else if (result.isDenied) {
                            }
                        })
                        // if its another error, just show the error
                    } else {
                        alert.error(error.response.status, "There was an error importing your quiz, please try again later")
                    }
                })
            xhr.onreadystatechange = function (e) {


            }
            // send a null response
            xhr.send(null)

        }
    }, [loading])

    // if component is loading data
    if (loading) {
        return (
            <>
                {/* return button and loading spinner */}
                <button className='generic-button' onClick={() => setOpen(true)}>Choose from your Google Classroom classes</button>
                <div className="loading-container">
                    <div className="loading-container-content">
                        <div className="loading-container-content-inner">
                            <CircularProgress />
                        </div>
                    </div>
                </div>
            </>
        )

        // else component isn't looking for data
    } else if (error) {
        return (
            <>
                {/* return button and loading spinner */}
                <button className='generic-button' onClick={() => setOpen(true)}>Choose from your Google Classroom classes</button>
                <div className="loading-container">
                    <div className="loading-container-content">
                        <div className="loading-container-content-inner">
                            <ErrorOutlineIcon />
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        function loadStudentTest() {
            axios.get('https://classroom.googleapis.com/v1/courses/466309248441/students?access_token=' + sessionStorage.authToken + '&pageSize=100')
                .then(function (response) {
                    // handle success
                    console.log(response.data);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        }
        // for each class in array, create a card
        const classList = classes.map((classObj, index) =>
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <h2>{classObj.name}</h2>
                    <p>{classObj.descriptionHeading}</p>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={() => createClass(index)}>Select Me</Button>
                </CardActions>
            </Card>

        )
        return (
            // return button
            <div>
                <button className='generic-button' onClick={() => setOpen(true)}>Choose from your Google Classroom classes</button>
                {/* dialog  */}
                <Dialog
                    className='background'
                    fullScreen
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Transition}
                >
                    {/* app bar for title */}
                    <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                Select a class
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <div className='classCards'>
                        {classList}

                    </div>
                </Dialog>

                {/* send announcment dialog */}
                <Dialog
                    fullWidth={true}
                    maxWidth={'lg'}

                    open={annoucnmentOpen}

                >
                    <DialogTitle>Your class has been created!</DialogTitle>
                    <DialogContent>
                        <h6>Would you like to share a link to join with your class?</h6>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => createAnnouncment()}>Yes please</Button>
                        <Button onClick={() => navigate('/class/' + classId)}>No thanks</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

}