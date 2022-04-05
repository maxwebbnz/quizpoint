/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
const NavBar = () => {
    return (
        <nav class="navbar navbar-dark bg-primary">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">QuizPoint</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarText">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="/">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="/classes">Your Classes</a>
                        </li>
                    </ul>
                    <span class="navbar-text">
                            <a class="nav-link" href="/logout">Sign Out</a>
                    </span>
                </div>
            </div>
        </nav>
    )
}

export default NavBar