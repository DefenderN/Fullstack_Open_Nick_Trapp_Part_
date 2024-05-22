import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [user, setUser] = useState(null)

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
        console.log('logging out')
        window.localStorage.removeItem('user')
        setUser(null)
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

    const userDisplay = () => {
        return (
            <div>
                <p>{user.name} is logged in</p>
                <button
                    type="button"
                    onClick={handleLogout}
                    >Logout</button>
            </div>
        )
    }

    return (
        <div>
    
            {user === null && loginForm()} 
            {user !== null && userDisplay()}

            <h2>blogs</h2>
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
            )}
        </div>
    )
}

export default App