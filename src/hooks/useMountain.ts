import { useState, useEffect, useCallback } from 'react';
import { db, type Mountain } from '../db/db';

export const useMountain = () => {
  const [mountains, setMountains] = useState<Mountain[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMountains = useCallback(async () => {
    setLoading(true);
    const data = await db.mountains.toArray();
    setMountains(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const load = async () => {
      setLoading(true);
      const data = await db.mountains.toArray();
      if (isMounted) {
        setMountains(data);
        setLoading(false);
      }
    };

    load();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const addMountain = async (mountain: Mountain) => {
    await db.mountains.add(mountain);
    await fetchMountains();
  };

  const updateMountain = async (id: number, changes: Partial<Mountain>) => {
    await db.mountains.update(id, changes);
    await fetchMountains();
  };

  const deleteMountain = async (id: number) => {
    await db.mountains.delete(id);
    await fetchMountains();
  };

  return {
    mountains,
    loading,
    addMountain,
    updateMountain,
    deleteMountain,
  };
};
