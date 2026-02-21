import { useState, useEffect, useCallback } from 'react';
import paymentService from '../services/paymentService';

export default function usePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const list = await paymentService.list();
      setPayments(list || []);
    } catch (err) {
      console.error('usePayments fetch error', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (payload) => {
    const res = await paymentService.create(payload);
    await fetch();
    return res;
  };

  const update = async (id, payload) => {
    const res = await paymentService.update(id, payload);
    await fetch();
    return res;
  };

  const remove = async (id) => {
    const res = await paymentService.remove(id);
    await fetch();
    return res;
  };

  const report = async (params) => {
    return paymentService.report(params);
  };

  return { payments, loading, error, refresh: fetch, create, update, remove, report };
}
