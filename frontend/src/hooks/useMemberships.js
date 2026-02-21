import { useState, useEffect, useCallback } from 'react';
import membershipService from '../services/membershipService';

export default function useMemberships() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const list = await membershipService.list();
      setMemberships(list || []);
    } catch (err) {
      console.error('useMemberships fetch error', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = async (payload) => {
    const res = await membershipService.create(payload);
    await fetch();
    return res;
  };

  const remove = async (id) => {
    const res = await membershipService.remove(id);
    await fetch();
    return res;
  };

  return {
    memberships,
    loading,
    error,
    refresh: fetch,
    create,
    remove
  };
}
