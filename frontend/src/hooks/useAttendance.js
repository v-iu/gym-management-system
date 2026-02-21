import { useState, useEffect, useCallback } from 'react';
import attendanceService from '../services/attendanceService';

function todayString(){
  return new Date().toISOString().slice(0,10);
}

export default function useAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [members, setMembers] = useState([]);
  const [guests, setGuests] = useState([]);
  const [staff, setStaff] = useState([]);

  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAvailableDates = useCallback(async () => {
    const dates = await attendanceService.listDates();
    setAvailableDates(dates || []);
    return dates || [];
  }, []);

  const fetchForDate = useCallback(async (date) => {
    setLoading(true);
    try {
      const [att, mem, gst, stf] = await Promise.all([
        attendanceService.getByDate(date),
        attendanceService.listMembers(),
        attendanceService.listGuests(),
        attendanceService.listStaff(),
      ]);
      setAttendance(att || []);
      setMembers(mem || []);
      setGuests(gst || []);
      setStaff(stf || []);
      setSelectedDate(date);
    } catch (err) {
      console.error('useAttendance fetchForDate error', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load: available dates, then pick sensible selectedDate
  useEffect(() => {
    (async () => {
      try {
        const dates = await fetchAvailableDates();
        const today = todayString();

        let initial = today;
        if (!dates || dates.length === 0) {
          // nothing recorded yet — show today (empty)
          initial = today;
        } else if (dates.includes(today)) {
          initial = today;
        } else {
          // default to most recent date with records
          initial = dates[0];
        }

        await fetchForDate(initial);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [fetchAvailableDates, fetchForDate]);

  const selectDate = async (date) => {
    if (!date) return;
    // only allow navigation to dates with attendance records (or to today)
    const today = todayString();
    if (date !== today && !availableDates.includes(date)) {
      throw new Error('No attendance records for selected date');
    }
    await fetchForDate(date);
  };

  const prevDate = () => {
    if (!selectedDate || !availableDates.length) return null;
    const idx = availableDates.indexOf(selectedDate);
    if (idx === -1) return null;
    const prev = availableDates[idx + 1]; // array is desc (most recent first)
    if (prev) selectDate(prev);
    return prev || null;
  };

  const nextDate = () => {
    if (!selectedDate || !availableDates.length) return null;
    const idx = availableDates.indexOf(selectedDate);
    if (idx <= 0) return null;
    const next = availableDates[idx - 1];
    if (next) selectDate(next);
    return next || null;
  };

  const refresh = async () => {
    await fetchAvailableDates();
    if (selectedDate) await fetchForDate(selectedDate);
  };

  const checkin = async ({ role, user_id, staff_id = null }) => {
    const today = todayString();
    if (selectedDate !== today) {
      throw new Error('Check-in allowed only for today');
    }

    const payload = { role, user_id };
    if (staff_id) payload.staff_id = staff_id;

    const res = await attendanceService.checkin(payload);
    await refresh();
    return res;
  };

  const checkout = async (attendanceId) => {
    const res = await attendanceService.checkout(attendanceId);
    await refresh();
    return res;
  };

  return {
    attendance,
    members,
    guests,
    staff,
    loading,
    error,
    availableDates,
    selectedDate,
    isToday: selectedDate === todayString(),
    selectDate,
    prevDate,
    nextDate,
    refresh,
    checkin,
    checkout
  };
}

