import { useState } from 'react';
import axios from 'axios';
import "../css/RegisterPage.css"

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [message, setMessage] = useState('');
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
        setMessage('');

        try {
            const response = await axios.post('/api/register', formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            setMessage(response.data.message);
            setFormData({ username: '', password: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Error register');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className='register-box'>
            <h2>Register</h2>
            <p>Already have an account? <a href='/login'>Login here</a> </p>
            <br />

            {message && <div>{message}</div>}
            {error && <div>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <br />
                    <input
                        className='register-textfield'
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
                        className='register-textfield'
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter password"
                        minLength="6"
                    />
                </div>
                <br />
                <button className="register-button" type="submit" disabled={loading}>
                    Register
                </button>
            </form>
        </div>
    );

}
export default RegisterPage