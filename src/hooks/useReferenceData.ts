import { useEffect, useState } from 'react';
import type { ActionTypeResponse, RoomResponse } from '../types';
import { actionTypesApi, roomsApi } from '../lib/backend';

export function useReferenceData() {
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [actionTypes, setActionTypes] = useState<ActionTypeResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([roomsApi.roomsGet(), actionTypesApi.actionTypesGet()])
      .then(([roomItems, actionTypeItems]) => {
        if (!alive) return;
        setRooms(roomItems);
        setActionTypes(actionTypeItems);
      })
      .catch(() => {
        if (!alive) return;
        setRooms([]);
        setActionTypes([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return { rooms, actionTypes, loading };
}
