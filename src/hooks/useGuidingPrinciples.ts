import { useState, useEffect, useCallback } from 'react';
import { db, type GuidingPrinciple } from '../db/db';

export const useGuidingPrinciples = () => {
  const [principles, setPrinciples] = useState<GuidingPrinciple[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrinciples = useCallback(async () => {
    setLoading(true);
    const data = await db.guidingPrinciples.toArray();
    setPrinciples(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const load = async () => {
      setLoading(true);
      const data = await db.guidingPrinciples.toArray();
      if (isMounted) {
        setPrinciples(data);
        setLoading(false);
      }
    };

    load();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const addPrinciple = async (principle: GuidingPrinciple) => {
    await db.guidingPrinciples.add(principle);
    await fetchPrinciples();
  };

  const updatePrinciple = async (id: number, changes: Partial<GuidingPrinciple>) => {
    await db.guidingPrinciples.update(id, changes);
    await fetchPrinciples();
  };

  const deletePrinciple = async (id: number) => {
    await db.guidingPrinciples.delete(id);
    await fetchPrinciples();
  };

  return {
    principles,
    loading,
    addPrinciple,
    updatePrinciple,
    deletePrinciple,
  };
};
