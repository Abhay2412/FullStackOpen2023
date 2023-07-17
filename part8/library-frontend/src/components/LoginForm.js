import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setError, setToken, show }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [login, result] = useMutation(LOGIN, {
        onError: (error) => {
            setError(error.graphQLErrors[0].message)
        }
    })

    useEffect(() => {
        if(result.data) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('library-user-token', token)
        }
    }, [result.data]) // eslint-disable-line

    if(!show) {
        return null
    }

    const submitLoginForm = async(event) => {
        event.preventDefault()

        login({ variables: { username, password } })

        setUsername('')
        setPassword('')
    }

    return(
        <div>
            <form onSubmit={submitLoginForm}>
                <div>
                    Username <input value={username} onChange={({ target }) => setUsername(target.value)} />
                </div>
                <div>
                    Password <input value={password} onChange={({ target }) => setPassword(target.value)} />
                </div>
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

export default LoginForm