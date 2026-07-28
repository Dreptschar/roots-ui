import { useEffect, useState } from 'react';

export function useImageSource(blob?: Blob) {
  const [source, setSource] = useState<string>();

  useEffect(() => {
    if (!blob) {
      setSource(undefined);
      return;
    }

    let cancelled = false;
    const reader = new FileReader();

    reader.onload = () => {
      if (!cancelled && typeof reader.result === 'string') {
        setSource(reader.result);
      }
    };
    reader.onerror = () => {
      if (!cancelled) {
        setSource(undefined);
      }
    };
    reader.readAsDataURL(blob);

    return () => {
      cancelled = true;
      if (reader.readyState === FileReader.LOADING) {
        reader.abort();
      }
    };
  }, [blob]);

  return source;
}
