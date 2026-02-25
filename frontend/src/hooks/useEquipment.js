import { useState, useEffect, useCallback } from 'react';
import equipmentService from '../services/equipmentService';

export default function useEquipment(){
    const [equipment, setEquipment] = useState([]);
    const [record, setRecord] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        try {
        const list = await equipmentService.list();
        setEquipment(list || []);
        } catch (err) {
        console.error('useEquipment fetch error', err);
        setError(err);
        } finally {
        setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetch();
    }, [fetch]);

    const fetchEquipmentRecord = useCallback(async (equipment_id) => {
        const eqRecord = await equipmentService.records(equipment_id);
        setRecord(eqRecord || []);
        return eqRecord || [];
    }, []);

    const create = async (payload) => {
        const res = await equipmentService.create(payload);
        await fetch();
        return res;
    };

    const remove = async (id) => {
        const res = await equipmentService.remove(id);
        await fetch();
        return res;
    };

    const update = async (id) => {
        const res = await equipmentService.update(id);
        await fetch();
        return res;
    }
}