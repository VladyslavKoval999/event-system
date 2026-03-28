import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { registerUser } from '../api/mockApi';

const schema = z.object({
  fullName: z.string().min(2, "Ім'я занадто коротке"),
  email: z.string().email("Некоректний формат Email"),
  birthDate: z.string().refine((dateStr) => {
    const today = new Date();
    const birthDate = new Date(dateStr);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  }, { message: "Вам має бути 18 років" }),
  source: z.enum(["social", "friends", "ads"], {
    errorMap: () => ({ message: "Оберіть варіант" })
  })
});

const RegistrationPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      await registerUser({ ...data, eventId });
      alert("Ви успішно зареєстровані!");
      navigate(`/participants/${eventId}`);
    } catch (error) {
      console.error(error);
      alert("Помилка реєстрації");
    }
  };

  return (
    <div className="app-container">
      <Link to="/" className="back-link">← Назад на головну</Link>
      
      <div className="form-container">
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Реєстрація на подію</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>ПІБ</label>
            <input type="text" {...register("fullName")} />
            {errors.fullName && <span className="error-text">{errors.fullName.message}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="text" {...register("email")} />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label>Дата народження</label>
            <input type="date" {...register("birthDate")} />
            {errors.birthDate && <span className="error-text">{errors.birthDate.message}</span>}
          </div>

          <div className="form-group">
            <label>Звідки дізналися?</label>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" value="social" {...register("source")} /> Соцмережі
              </label>
              <label className="radio-label">
                <input type="radio" value="friends" {...register("source")} /> Друзі
              </label>
              <label className="radio-label">
                <input type="radio" value="ads" {...register("source")} /> Реклама
              </label>
            </div>
            {errors.source && <span className="error-text">{errors.source.message}</span>}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{width: '100%', marginTop: '20px'}}>
            {isSubmitting ? "Відправка..." : "Зареєструватися"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;