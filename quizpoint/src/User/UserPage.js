/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
//* Import statements
import { useParams } from "react-router-dom"
import { user } from '../firebase/fb.user'
import './UserPage.css'
import { Card, ListGroup, Button } from 'react-bootstrap';


/**==============================================
 **              Users()
 *?  What does it do? Handles content generation and rendering of user page
 *@param name type
 *@param name type
 *@return type
 *=============================================**/
export default function Users() {
    // get parameter
    let { id } = useParams()
    // check page wants local user
    if (id === "local") {
        // set variable to local user
        let userDisplayed = user
        // template for user page
        return (
            <div className="user-page center">
                {/* left card */}
                <div className="userImage">
                    <Card style={{ width: '18rem' }}>
                        {/* this renders funny */}
                        <Card.Img variant="top" src={userDisplayed.picture} />
                        <Card.Body>
                            <Card.Title>{userDisplayed.name}</Card.Title>
                        </Card.Body>
                    </Card>
                </div>
                <div className="user-info">
                    {/* right card */}
                    <Card style={{ width: '20rem' }}>
                        <Card.Header><b>Details</b></Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Student ID: {userDisplayed.studentID}</ListGroup.Item>
                            <ListGroup.Item>Email: {userDisplayed.email}</ListGroup.Item>
                        </ListGroup>
                    </Card>
                    <Button className='logOutButton' href='/logout'>Logout</Button>
                </div>
            </div>
        )
    }

}
