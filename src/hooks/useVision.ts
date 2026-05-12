import { useState, useEffect, useCallback } from 'react';
import { db, type Vision } from '../db/db';

export const useVision = () => {
  const [visions, setVisions] = useState<Vision[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVisions = useCallback(async () => {
    setLoading(true);
    const data = await db.visions.toArray();
    setVisions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const load = async () => {
      setLoading(true);
      const data = await db.visions.toArray();
      if (isMounted) {
        setVisions(data);
        setLoading(false);
      }
    };

    load();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const addVision = async (vision: Vision) => {
    await db.visions.add(vision);
    await fetchVisions();
  };

  const bulkAddVisions = async (newVisions: Vision[]) => {
    await db.visions.bulkAdd(newVisions);
    await fetchVisions();
  };

  const updateVision = async (id: number, changes: Partial<Vision>) => {
    await db.visions.update(id, changes);
    await fetchVisions();
  };

  const deleteVision = async (id: number) => {
    await db.visions.delete(id);
    await fetchVisions();
  };

  return {
    visions,
    loading,
    addVision,
    bulkAddVisions,
    updateVision,
    deleteVision,
  };
};
