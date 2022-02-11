let cls = {
    show: function(_inf) {
        switchScreen('homePage', 'classPage')
        console.log(_inf)
        let currentClass = classList[_inf]
        console.log(currentClass)
            // define elements
        let teacher = document.getElementById('classTeacher')
        let name = document.getElementById('className')
        let code = document.getElementById('classCode')
            //    set elements.
        teacher.innerHTML = currentClass.teacher
        name.innerHTML = currentClass.classroom
        code.innerHTML = currentClass.code
            // set background image
        let lengthofPosts = Object.keys(classList[_inf].posts).length;

        if (lengthofPosts > 0) {
            console.log("I have posts")
            this.posts(_inf);
        } else {
            console.log("I have no posts")
        }
    },
    /**==============================================
     **              Post Handler
     *?  What does it do? Displays posts
     *@param name type  
     *@param name type  
     *@return type
     *=============================================**/
    posts: function(_inf) {
        console.log(_inf)
        let postsArray = []
        let infPt = classList[_inf].posts
        Object.entries(infPt).forEach(entry => {
            const [key, value] = entry;
            postsArray.push(entry)
        });

        for (var i = 0; i < postsArray.length; i++) {
            let currentPost = postsArray[i]
            let author = currentPost[1].author
            let contents = currentPost[1].content
            console.log(currentPost[1].author)
            console.log(currentPost[1].content)
            let post = document.createElement('div')
            let header = document.createElement('div')
            let headerImg = document.createElement('img')
            let headerNm = document.createElement('p')
            let content = document.createElement('div')
            let contentTxt = document.createElement('p')
            post.className = "post"
            header.className = 'header'
            headerImg.style = "width: 50px; height: 50px; justify-items: center;"
            headerImg.src = 'https://humanimals.co.nz/wp-content/uploads/2019/11/blank-profile-picture-973460_640.png'
            headerImg.className = 'rounded-circle';
            headerImg.alt = 'User Image'
            headerNm.className = 'username'
            headerNm.innerHTML = author;
            content.className = 'content'
            contentTxt.innerHTML = contents;

            let posts = document.getElementById('posts')
            header.appendChild(headerImg)
            header.appendChild(headerNm)
            content.appendChild(contentTxt)
            post.appendChild(header)
            post.appendChild(content)
            posts.appendChild(post)

        }



    }
}