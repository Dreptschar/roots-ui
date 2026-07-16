import { useEffect, useState } from 'react';
import { getActionTypes, getRooms } from '../lib/localDb';
import {ActionTypeRecord, RoomRecord} from "../dbTypes";

export function useReferenceData() {
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [actionTypes, setActionTypes] = useState<ActionTypeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async (alive = true, options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setLoading(true);
    }
    try {
      const [roomItems, actionTypeItems] = await Promise.all([getRooms(), getActionTypes()]);
      if (!alive) return;
      setRooms(roomItems);
      setActionTypes(actionTypeItems);
    } catch {
      if (!alive) return;
      setRooms([]);
      setActionTypes([]);
    } finally {
      if (alive && !options?.silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let alive = true;
    void refresh(alive);

    return () => {
      alive = false;
    };
  }, []);

  return { rooms, actionTypes, loading, refresh };
}
