import { useState } from 'react';
import axios from 'axios';
import "../css/LoginPage.css"

function LoginPage({ onLogin }) {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/login', formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            onLogin(response.data.user);
            setFormData({ username: '', password: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Error logging in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='login-box'>
            <h2>Login</h2>
            <p>Don't have an account? <a href='/register'>Register here</a> </p>
            <br />

            {error && <div>{error}</div>}

            <form onSubmit={handleSubmit} >
                <div>
                    <label htmlFor="username">Username:</label>
                    <br />
                    <input className='log-in-textfield'
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Enter username"
                    />
                </div>
                <br />
                <div>
                    <label htmlFor="password">Password:</label>
                    <br />
                    <input
                        className='log-in-textfield'
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter password"
                    />
                </div>
                <br />
                <button type="submit" disabled={loading} className='log-in-button'>
                    {loading ? 'Logging in...' : 'Log in'}
                </button>
            </form>
        </div>
    );
};

export default LoginPage