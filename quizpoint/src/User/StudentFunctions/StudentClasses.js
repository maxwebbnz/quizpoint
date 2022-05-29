/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { db } from '../../services/firebase'
import { ref, onValue } from "firebase/database";
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';

import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
export default function StudentClasses(props) {
    let student = props.studentObject
    const [loading, setLoading] = useState(true)
    let classes = []
    useEffect(() => {
        if (loading) {
            console.log(student)
            /**==============================================
            **              loadData()
            *?  What does it do? Load data from Firebase for each student
            *=============================================**/
            function loadData() {
                // console log
                console.log('loading all students data')
                //! this should check for each users role before pushing to array
                // // wait for data
                // onValue(pathRef, (snapshot) => {
                //     // if there is no students, something definelty went wrong.
                //     if (snapshot === undefined) {
                //         console.log('ERROR - NO DATA FOUND')

                //         // if students do exist
                //     } else {
                //         // set placeholder to object of students
                //         const data = snapshot.val()
                //         // for each student value


                //         // finished loading, we can show page now
                //
                //     }
                // })
                var toBeat = 0;
                var currentNum = 0
                for (var a in student.classes) {
                    ++toBeat
                }

                Object.keys(student.classes).forEach(function (key) {
                    console.log(key)
                    if (key === 'notEnrolled') {
                        setLoading(false)
                    } else {
                        let trimmedKey = key.trim()
                        let pathRef = ref(db, `/schools/hvhs/classes/${trimmedKey}`);
                        console.log(`/schools/hvhs/classes/${trimmedKey
                            }`)
                        onValue(pathRef, (snapshot) => {
                            if (snapshot.val() === undefined || snapshot.val() === null) {
                                console.log("invalid class code")
                            } else {
                                const data = snapshot.val()
                                if (data === null) {
                                    console.log("invalid class code")
                                } else {
                                    console.log(data)
                                    classes.push(data)
                                    ++currentNum
                                }
                            }

                            if (currentNum < toBeat) {
                                console.log('not loaded yet' + currentNum + ' ' + toBeat)
                                console.log(classes)
                            } else {
                                console.log('loaded')
                                setLoading(true)
                            }
                        })
                    }


                });
            }
            // trigger function
            loadData()

        }


        setLoading(false)

    });


    if (loading) {
        <h1>Loading</h1>
    } else {


        let classCards/* Mapping through the array of classes and returning a h1 tag with the class name. */
        classCards = classes.map((classInfo) =>
            <div>

                <Card sx={{ width: 275 }}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="100"
                            image="https://99designs-blog.imgix.net/blog/wp-content/uploads/2018/12/Gradient_builder_2.jpg"
                            alt="green iguana"
                        />
                        <CardContent>
                            <Typography variant="h5" component="div">
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                Taught by {classInfo.classCreator}
                            </Typography>
                            <Typography variant="h4">
                                {classInfo.className}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" href={'/class/' + classInfo.code}>View Class</Button>
                        </CardActions>
                    </CardActionArea>
                </Card>

            </div>
        );

        return (
            <div>{classCards}</div>
        )
    }

}