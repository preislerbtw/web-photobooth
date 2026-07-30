import { useRef, useState, useCallback, useEffect } from 'react';

export function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [devices, setDevices] = useState([]);

  // vai listar as câmeras disponíveis (só retorna labels depois da 1ª permissão concedida)
  const listDevices = useCallback(async () => {
    const all = await navigator.mediaDevices.enumerateDevices();
    const cams = all.filter((d) => d.kind === 'videoinput');
    setDevices(cams);
    return cams;
  }, []);

  const startCamera = useCallback(async (deviceId) => {
    setError(null);
    setIsReady(false);

    // para o stream anterior antes de trocar de câmera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: 'user', width: 1280, height: 720 },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsReady(true);
      }

      await listDevices();
    } catch (err) {
      setError(err.message || 'Não foi possível acessar a câmera');
    }
  }, [listDevices]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsReady(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return { videoRef, error, isReady, devices, startCamera, stopCamera };
}