import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearEventsError } from '../redux/slices/eventsSlice';
import { clearParticipantsError } from '../redux/slices/participantsSlice';

const ErrorToast = () => {
  const eventsError = useSelector(state => state.events.error);
  const participantsError = useSelector(state => state.participants.error);
  const dispatch = useDispatch();

  const activeError = eventsError || participantsError;

  useEffect(() => {
    if (activeError) {
      const timer = setTimeout(() => {
        dispatch(clearEventsError());
        dispatch(clearParticipantsError());
      }, 4000); // Зникає через 4 секунди
      return () => clearTimeout(timer);
    }
  }, [activeError, dispatch]);

  if (!activeError) return null;

  return (
    <div className="error-toast">
      🚨 Помилка: {activeError}
    </div>
  );
};

export default ErrorToast;