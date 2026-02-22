import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import useAttendance from '../hooks/useAttendance';
import GuestPaymentForm from '../components/payments/GuestPaymentForm';
import Modal from '../components/common/Modal';
import paymentService from '../services/paymentService';
import CheckInWidget from '../components/attendance/CheckInWidget';
import UserDirectory from '../components/attendance/UserDirectory';
import AttendanceLog from '../components/attendance/AttendanceLog';

export default function AttendancePage() {
  const {
    attendance,
    members,
    guests,
    staff,
    loading,
    availableDates,
    selectedDate,
    isToday,
    selectDate,
    prevDate,
    nextDate,
    checkin,
    checkout
  } = useAttendance();

  const [checkinMsg, setCheckinMsg] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingGuestId, setPendingGuestId] = useState(null);

  const handleCheckin = async (role, userId) => {
    if (role === 'guest') {
      try {
        const paid = await paymentService.hasPaidToday(userId);
        if (!paid) {
          setPendingGuestId(userId);
          setShowPaymentModal(true);
          return;
        }
      } catch (err) {
        setPendingGuestId(userId);
        setShowPaymentModal(true);
        return;
      }
    }

    try {
      const res = await checkin({ role, user_id: parseInt(userId, 10) });
      setCheckinMsg({ type: 'success', text: res.message });
    } catch (err) {
      const message = err?.data?.message || err?.message || 'Check-in failed';
      setCheckinMsg({ type: 'error', text: message });
    }

    setTimeout(() => setCheckinMsg(null), 4000);
  };

  const handleCheckout = async (row) => {
    try {
      await checkout(row.id);
    } catch (err) {
      console.error('Checkout failed:', err);
    }
  };

  const paymentGuest = pendingGuestId 
    ? guests.find(g => g.id === parseInt(pendingGuestId, 10)) 
    : (selectedUser?.role === 'guest' ? selectedUser : null);

  return (
    <div>
      <PageHeader title="Attendance" subtitle="Check in members, staff & guests" />

      <CheckInWidget 
        members={members}
        guests={guests}
        staff={staff}
        isToday={isToday}
        onCheckIn={handleCheckin}
        selectedUser={selectedUser}
        checkinMsg={checkinMsg}
      />

      <UserDirectory 
        onSelect={(user) => {
          setSelectedUser({ ...user, name: `${user.first_name} ${user.last_name}` });
          setCheckinMsg({ type: 'success', text: `Selected ${user.first_name} ${user.last_name}` });
          setTimeout(() => setCheckinMsg(null), 1400);
        }}
      />

      <AttendanceLog 
        attendance={attendance}
        loading={loading}
        selectedDate={selectedDate}
        availableDates={availableDates}
        isToday={isToday}
        onDateChange={selectDate}
        onPrevDate={prevDate}
        onNextDate={nextDate}
        onCheckout={handleCheckout}
      />

      <Modal isOpen={showPaymentModal} onClose={() => { setShowPaymentModal(false); setPendingGuestId(null); }} title="Collect Guest Payment">
        {paymentGuest && (
          <GuestPaymentForm
            guest={paymentGuest}
            staffList={staff}
            onCancel={() => { setShowPaymentModal(false); setPendingGuestId(null); }}
            onSubmit={async (payload) => {
              await paymentService.create(payload);
              setShowPaymentModal(false);

              try {
                const uid = paymentGuest.id;
                await checkin({ 
                  role: 'guest', 
                  user_id: Number.isNaN(uid) ? undefined : uid, 
                  staff_id: payload.staff_id ? parseInt(payload.staff_id, 10) : undefined 
                });
                setCheckinMsg({ type: 'success', text: 'Payment recorded and checked in' });
              } catch (err) {
                console.error('Checkin after payment failed', err);
                setCheckinMsg({ type: 'error', text: 'Payment recorded but check-in failed' });
              }
              setPendingGuestId(null);
              setTimeout(() => setCheckinMsg(null), 2500);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
