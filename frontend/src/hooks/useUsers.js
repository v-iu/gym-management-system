import { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';

export default function useUsers(role = null) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const list = role ? await userService.listByRole(role) : await userService.list();
      setUsers(list || []);
    } catch (err) {
      console.error('useUsers fetch error', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => { fetch(); }, [fetch]);

  return { users, loading, error, refresh: fetch };
}
