import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputText from '../../components/Input/InputText';
import ErrorText from '../../components/Typography/ErrorText';
import { loginUser } from '../../app/api';

function Login() {
    const INITIAL_LOGIN_OBJ = {
        email: '',
        password: ''
    };

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const submitForm = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        
        const { email, password } = loginObj;

        if (!email.trim()) return setErrorMessage('Email is required!');
        if (!password.trim()) return setErrorMessage('Password is required!');

        setLoading(true);
        
        try {
            const result = await loginUser(email, password);
            
            if (result.status) {
                alert("Login successful!");
                navigate('/app/dashboard');
            } else {
                setErrorMessage(result.message);
            }
        } catch (error) {
            setErrorMessage(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage('');
        setLoginObj({ ...loginObj, [updateType]: value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center py-8">
            <div className="card mx-auto w-full max-w-lg shadow-xl rounded-xl overflow-hidden">
                <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
                    <div className="relative hidden md:block">
                        <img
                            src="https://imgs.search.brave.com/SGcF1woO2EQf2SBeekYPEF-KaGvxlHa9J9wsXoOnuaQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmV0/c3lzdGF0aWMuY29t/LzMzNTc0MDMzL3Iv/aWwvYjU5ZGVkLzQ1/MzA1MjExNTIvaWxf/NjAweDYwMC40NTMw/NTIxMTUyX3E5aGwu/anBn"
                            alt="Login Image"
                            className="w-full h-full object-cover rounded-l-xl"
                        />
                        <div className="absolute inset-0 bg-black opacity-30"></div>
                    </div>
                    <div className='py-16 px-10'>
                        <h2 className='text-3xl font-semibold mb-4 text-center text-primary'>Login</h2>
                        <form onSubmit={submitForm}>
                            <div className="mb-6">
                                <InputText
                                    defaultValue={loginObj.email}
                                    type="email"
                                    updateType="email"
                                    containerStyle="mt-4"
                                    labelTitle="Email"
                                    updateFormValue={updateFormValue}
                                />
                                <div className="relative mt-4">
                                    <InputText
                                        defaultValue={loginObj.password}
                                        type={showPassword ? "text" : "password"}
                                        updateType="password"
                                        containerStyle="mt-4"
                                        labelTitle="Password"
                                        updateFormValue={updateFormValue}
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-1/2 mt-4 right-3 transform -translate-y-1/2"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>

                            <div className='text-right text-primary'>
                                <Link to="/forgot-password">
                                    <span className="text-sm inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Forgot Password?</span>
                                </Link>
                            </div>

                            <ErrorText styleClass="mt-6">{errorMessage}</ErrorText>
                            <button type="submit" className={"btn mt-6 w-full bg-orange-500 text-white" + (loading ? " loading" : "")}>Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
