import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/index';

const loginSchema = z.object({
    email: z.string().email("Невірний формат email"),
    password: z.string().min(6, "Мінімум 6 символів")
});

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });

    const onSubmit = async (data) => {
        try {
            const res = await loginUser(data);
            dispatch(loginSuccess(res.user));
            alert("Успішний вхід!");
            navigate('/');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="app-container">
            <Link to="/" className="back-link">← Назад</Link>
            <div className="form-container">
                <h2 style={{textAlign: 'center', marginBottom: '20px'}}>Вхід (Організатор)</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <input {...register('email')} placeholder="Email" style={{ width: '100%', padding: '10px' }} />
                        {errors.email && <p className="error-text">{errors.email.message}</p>}
                    </div>
                    <div className="form-group">
                        <input type="password" {...register('password')} placeholder="Пароль" style={{ width: '100%', padding: '10px' }} />
                        {errors.password && <p className="error-text">{errors.password.message}</p>}
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Увійти</button>
                </form>
            </div>
        </div>
    );
};
export default Login;