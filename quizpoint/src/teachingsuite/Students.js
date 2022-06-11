/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

// styling
import './Students.css'
// react hooks
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import React, { useState, useEffect } from 'react'
// database
import { db } from '../services/firebase'
// components from libs
import { ref, onValue } from "firebase/database";
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import { useParams, useNavigate } from "react-router-dom"
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
// reactUI material
import { DataGrid } from '@mui/x-data-grid';
// material ui
import Backdrop from '@mui/material/Backdrop';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CircularProgress from '@mui/material/CircularProgress';
// array placeholder

// Material UI for Styled Components
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ButtonGroup from '@mui/material/ButtonGroup';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import Tooltip from '@mui/material/Tooltip';

const rows = []

/**==============================================
 **              Students
 *?  What does it do? Component for handling student list on teaching suite
 *@return type
 *=============================================**/
export default function Students() {
    const navigate = useNavigate()
    let { type } = useParams()
    const [searchValue, setSearchValue] = useState("")
    const [selectedStudentUID, setUID] = useState("")
    // state holder data fetching
    const [loading, dataFetch] = useState(false)
    const [userLoaded, setUserLoaded] = useState({})
    const [allStudents, setStudentList] = useState([])
    const [select, setSelection] = React.useState([]);
    const [userActiveQuiz, setActiveQuiz] = useState([])
    const [userClasses, setClasses] = useState([])
    const handleRowSelection = (e) => {
        // prints correct indexes of selected rows
        console.log("adding", e);
        // missing the first row selected
        setSelection(e);
        // console.log(select);
    };
    var shouldFade = true;
    console.log('Students() | Loading Data')
    /**======================
     **   useEffect
     *? Hook from react.js
     *========================**/
    useEffect(() => {
        // LOADING DATA, FETCHING FROM DB.
        if (loading === true) {
            if (selectedStudentUID !== "") {
                setActiveQuiz([])
                setClasses([])
                console.log(allStudents)
                let foundStudent = allStudents.find(element => element.uid === selectedStudentUID);
                console.log(foundStudent)
                setUserLoaded(foundStudent)
                let pathRef = ref(db, `/schools/hvhs/users/${selectedStudentUID}`)
                onValue(pathRef, (snapshot) => {
                    if (snapshot.val() === null) {
                        console.log("no user found")
                    } else {
                        setUserLoaded(snapshot.val())
                        let data = snapshot.val()
                        console.log(data)
                        console.log(data.classes)

                        Object.keys(data.classes).forEach(key => {
                            let classPath = ref(db, `/schools/hvhs/classes/${key}`)
                            onValue(classPath, (snapshot) => {
                                if (snapshot.val() === null) { } else {
                                    setClasses(prevClasses => [...prevClasses, snapshot.val()])
                                }
                            })
                        })
                        console.log(data.quizzes.active)
                        Object.keys(data.quizzes.active).forEach(key => {
                            setActiveQuiz(prevQuiz => [...prevQuiz, data.quizzes.active[key]])
                        })
                    }
                })
            } else {
                setUserLoaded({})
            }
            document.title = `${userLoaded.name}'s Profile | QuizPoint`
            console.log('Loading')

            // Currently fetching data
        } else {
            if (type === 'all') {
                document.title = 'Loading Students | QuizPoint'
                console.log('Loading')

                /**==============================================
                 **              loadData()
                 *?  What does it do? Load data from Firebase for each student
                 *=============================================**/
                function loadData() {
                    // console log
                    console.log('loading all students data')
                    //! this should check for each users role before pushing to array
                    const pathRef = ref(db, `/schools/hvhs/users/`);
                    // wait for data
                    onValue(pathRef, (snapshot) => {
                        // if there is no students, something definelty went wrong.
                        if (snapshot === undefined) {
                            console.log('ERROR - NO DATA FOUND')

                            // if students do exist
                        } else {
                            // set placeholder to object of students
                            const data = snapshot.val()
                            // for each student value

                            Object.keys(data).forEach(function (key) {
                                // console.log(data[key])
                                // push to placeholder array
                                rows.push({
                                    id: key,
                                    name: data[key].name,
                                    studentID: data[key].studentID,
                                    uid: data[key].uid
                                })
                                allStudents.push(data[key])
                            });
                            if (selectedStudentUID === '') {

                            } else {
                                let pathRef = ref(db, `/schools/hvhs/users/${selectedStudentUID}`)
                                onValue(pathRef, (snapshot) => {
                                    if (snapshot.val() === null) {
                                        console.log("no user found")
                                    } else {
                                        setUserLoaded(snapshot.val())
                                        let data = snapshot.val()
                                        console.log(data)
                                        console.log(data.classes)

                                        Object.keys(data.classes).forEach(key => {
                                            let classPath = ref(db, `/schools/hvhs/classes/${key}`)
                                            onValue(classPath, (snapshot) => {
                                                if (snapshot.val() === null) { } else {
                                                    setClasses(prevClasses => [...prevClasses, snapshot.val()])
                                                }
                                            })
                                        })
                                        console.log(data.quizzes.active)
                                        Object.keys(data.quizzes.active).forEach(key => {
                                            setActiveQuiz(prevQuiz => [...prevQuiz, data.quizzes.active[key]])
                                        })
                                    }
                                })
                            }
                            // finished loading, we can show page now
                            dataFetch(true)
                        }
                    })
                }
                // trigger function
                loadData()

            }
        }
    }, [loading, selectedStudentUID, allStudents, type, userLoaded])



    const [search, setSearch] = useState(allStudents);
    const handleInputChange = (e) => {
        var dm = e.target.value;
        var str = dm.toLowerCase();
        var debug = allStudents.filter(x => x["name"].toLowerCase().includes(str));
        setSearch(debug);
    };


    // if loading
    if (loading === false) {
        // feed that back to user
        return (
            <div>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={shouldFade}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        )
    } else {

        // return HTML component
        return (
            <Fade in={shouldFade}>
                <div clasName='studentPage'>
                    <div className='studentgrid'>
                        <div className='studentpage-search'>
                            <div className='studentpage-search-header'>
                                <p><SearchOutlinedIcon></SearchOutlinedIcon> Student Search Filter</p>
                                <TextField id="outlined-basic" onChange={handleInputChange} label="Student Name" variant="outlined" />

                            </div>
                            <hr></hr>
                            <div className='search-results'>
                                <p>Search Results</p>

                                {search.map((item) => (
                                    <div className='search-result' key={item.id} onClick={() => setUID(item.uid)}>
                                        <hr />
                                        <p>{item.name} - {item.studentID}</p>
                                    </div>
                                ))}
                            </div>

                        </div>
                        <div className='studentpage-userview'>
                            {userLoaded.name === undefined ? <h1 className='selectuser-text'>Select a user</h1> :
                                <Fade in={shouldFade}>
                                    <div className='user-page-container'>
                                        <div className='banner-details'>
                                            <InfoOutlinedIcon></InfoOutlinedIcon> {userLoaded.name}
                                        </div>
                                        <div className="user-page-actions">
                                            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                                <Button onClick={() => navigate('/tcs/reports/student/' + userLoaded.uid)}><AssessmentOutlinedIcon></AssessmentOutlinedIcon> View Report</Button>
                                                <Button><SchoolOutlinedIcon></SchoolOutlinedIcon> Add Class</Button>
                                                <Button><PersonRemoveOutlinedIcon></PersonRemoveOutlinedIcon> Remove Student</Button>
                                            </ButtonGroup>
                                        </div>
                                        <div className="user-content">
                                            <div className="user-content-left">
                                                {/* User Profile Picture */}
                                                <Tooltip title="Image taken from students google account">
                                                    {/* On image hover, message displayed */}
                                                    <img alt='User profile' src={userLoaded.picture}></img>
                                                </Tooltip>
                                            </div>
                                            <div className="user-content-right">
                                                {/* Basic Student information */}
                                                <p>Name: {userLoaded.name}</p>
                                                <p>Student ID: {userLoaded.studentID}</p>
                                                {/* when you click on link, it will send email */}
                                                <p>Email: <a href={'mailto:' + userLoaded.email}>{userLoaded.email}</a></p>
                                            </div>

                                        </div>
                                        <div className="banner-class">
                                            {/* Banner 2 - Class */}
                                            <h5><SchoolOutlinedIcon></SchoolOutlinedIcon> Classes</h5>
                                        </div>
                                        <div className="user-classcards">
                                            <div className="classCards-row">
                                                {/* Mapped Class Cards */}
                                                {userClasses.map((classData, index) => {
                                                    // just some JSX!
                                                    return (
                                                        <div className="class-card" key={index}>
                                                            <Card className="class-card-content">
                                                                <CardContent>
                                                                    <h1>{classData.className}</h1>
                                                                </CardContent>
                                                                <CardActions>
                                                                    <ButtonGroup size="small" variant="text" color="primary" aria-label="text primary button group">
                                                                        <Button onClick={() => navigate('/tcs/reports/class/' + classData.code)}><AssessmentOutlinedIcon /></Button>
                                                                        <Button onClick={() => navigate('/class/' + classData.code)}><OpenInNewOutlinedIcon /></Button>
                                                                        <Button><SchoolOutlinedIcon /></Button>
                                                                        <Button><PersonRemoveOutlinedIcon /></Button>
                                                                    </ButtonGroup>
                                                                </CardActions>
                                                            </Card>
                                                        </div>
                                                    )
                                                })
                                                }
                                            </div>
                                        </div>
                                        <div className="banner-quiz">
                                            {/* Banner 3 - Quiz */}
                                            <h5><QuizOutlinedIcon></QuizOutlinedIcon> Quiz History</h5>
                                        </div>
                                        <div className="user-quizhistory">
                                            {/* Quiz Section */}
                                            <h4>Currently Assigned</h4>
                                            <div className="classCards-row">
                                                {/* Mapped Quiz Active Cards */}
                                                {userActiveQuiz.map((quizData, index) => {
                                                    // just some JSX!
                                                    return (
                                                        <div className="class-card" key={index}>
                                                            <Card className="class-card-content">
                                                                <CardContent>
                                                                    <h6>{quizData.details.name}</h6>
                                                                </CardContent>
                                                                <CardActions>
                                                                    <ButtonGroup size="small" variant="text" color="primary" aria-label="text primary button group">
                                                                        <Button><AssessmentOutlinedIcon /></Button>
                                                                    </ButtonGroup>
                                                                </CardActions>
                                                            </Card>
                                                        </div>
                                                    )
                                                })
                                                }
                                            </div>
                                        </div>

                                    </div>
                                </Fade>
                            }
                        </div>
                    </div>
                </div>
            </Fade>
        )
    }
}

