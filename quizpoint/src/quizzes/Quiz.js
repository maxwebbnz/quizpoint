/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
import { Component } from "react"

/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

export default class Quiz extends Component {
    render() {
        return (
            <h2>Quiz dashboard page, page content for quiz {this.props.match.params.id}</h2>
        )
    }
}