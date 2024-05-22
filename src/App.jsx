import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [user, setUser] = useState(null)

    const [blogTitle, setBlogTitle] = useState("")
    const [blogAuthor, setBlogAuthor] = useState("")
    const [blogUrl, setBlogUrl] = useState("")


    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs( blogs )
            )  
    }, [])

    // Find user data in local storage from previous session
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('user')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            // noteService.setToken(user.token)
        }
      }, [])

    const handleLogin = async (event) => {
        event.preventDefault()
        console.log('logging in with', username, password)

        try {
            // HTTP request to log in
            const user = await loginService.login( username, password )
            setUser(user)
            setUsername('')
            setPassword('')

            // save user to local storage
            window.localStorage.setItem("user", JSON.stringify(user))

        } catch (exception) {
            console.log('Wrong credentials')
        }
    }

    const handleLogout = (event) => {
        event.preventDefault()
        console.log('logging out')
        window.localStorage.removeItem('user')
        setUser(null)
    }

    const handleCreateNewBlog = async (event) => {
        event.preventDefault()
        console.log('Create new Blog')

        // Create newBlog object
        const newBlog = {
            title: blogTitle,
            author: blogAuthor,
            url: blogUrl
        }

        try {
            const createdBlog = await blogService.create(newBlog, user.token);
            console.log('Blog created:', createdBlog);
            // reset form fields
            setBlogTitle("");
            setBlogAuthor("");
            setBlogUrl("");
        } catch (error) {
            console.error('Failed to create blog:', error);
        }
    }

    const loginForm = () => {
        return (
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        )
    }

    const BlogForm = () => {
        return (
    <form onSubmit={handleCreateNewBlog} style={{ maxWidth: '300px', margin: '10px' }}>
        <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'center' }}>
            <label style={{ width: '100px', marginRight: '10px' }}>Title</label>
            <input
                type="text"
                value={blogTitle}
                name="Blogtitle"
                onChange={({ target }) => setBlogTitle(target.value)}
            />
        </div>
        <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'center' }}>
            <label style={{ width: '100px', marginRight: '10px' }}>Author</label>
            <input
                type="text"
                value={blogAuthor}
                name="Blogauthor"
                onChange={({ target }) => setBlogAuthor(target.value)}
            />
        </div>
        <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'center' }}>
            <label style={{ width: '100px', marginRight: '10px' }}>Url</label>
            <input
                type="text"
                value={blogUrl}
                name="Blogurl"
                onChange={({ target }) => setBlogUrl(target.value)}
            />
        </div>
        <button type="submit">Add new blog</button>
    </form>  
        )
    }

    const userDisplay = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ margin: 0, marginRight: '10px' }}>
                    {user.name} is logged in
                </p>
                <button type="button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        )
    }

    return (
        <div>
    
            {user === null && loginForm()} 
            {user !== null && userDisplay()}
            {user !== null && BlogForm()}

            <h2>blogs</h2>
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
            )}
        </div>
    )
}

export default App