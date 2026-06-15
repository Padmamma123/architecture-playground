import { useState, useEffect, useRef, useCallback } from 'react';
import type { StoryCharacter } from '../types';

const CHARACTER_VOICE_PROFILES: Record<number, { rate: number; pitch: number }> = {
  0: { rate: 1.0, pitch: 1.0 },
  1: { rate: 0.92, pitch: 0.85 },
  2: { rate: 1.08, pitch: 1.15 },
  3: { rate: 0.88, pitch: 0.75 },
};

function pickEnglishVoices(): SpeechSynthesisVoice[] {
  const voices = window.speechSynthesis.getVoices();
  const english = voices.filter((v) => v.lang.startsWith('en'));
  return english.length > 0 ? english : voices;
}

function voiceForCharacter(voices: SpeechSynthesisVoice[], index: number): SpeechSynthesisVoice | undefined {
  if (!voices.length) return undefined;
  // Prefer distinct named voices (Google, Microsoft, etc.)
  const preferred = voices.filter((v) =>
    /google|microsoft|zira|david|samantha|karen|daniel|female|male/i.test(v.name)
  );
  const pool = preferred.length >= 2 ? preferred : voices;
  return pool[index % pool.length];
}

export function useStorySpeech(characters: StoryCharacter[]) {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voicesReady, setVoicesReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const onEndRef = useRef<(() => void) | undefined>(undefined);

  const loadVoices = useCallback(() => {
    voicesRef.current = pickEnglishVoices();
    if (voicesRef.current.length > 0) setVoicesReady(true);
  }, []);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, [loadVoices]);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const pause = useCallback(() => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
    setIsSpeaking(false);
  }, []);

  const resume = useCallback(() => {
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsSpeaking(true);
    }
  }, []);

  const speak = useCallback(
    (text: string, character: StoryCharacter, onEnd?: () => void) => {
      if (!('speechSynthesis' in window)) {
        onEnd?.();
        return;
      }

      if (!voiceEnabled) {
        return; // caller handles pacing via typewriter
      }

      const doSpeak = () => {
        window.speechSynthesis.cancel();
        onEndRef.current = onEnd;

        const charIndex = characters.findIndex((c) => c.id === character.id);
        const profile = CHARACTER_VOICE_PROFILES[charIndex % 4] ?? CHARACTER_VOICE_PROFILES[0];
        const voice = voiceForCharacter(voicesRef.current, charIndex >= 0 ? charIndex : 0);

        const utterance = new SpeechSynthesisUtterance(text);
        if (voice) utterance.voice = voice;
        utterance.rate = profile.rate;
        utterance.pitch = profile.pitch;
        utterance.volume = 1;
        utterance.lang = 'en-US';

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          onEndRef.current?.();
          onEndRef.current = undefined;
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
          onEndRef.current?.();
          onEndRef.current = undefined;
        };

        window.speechSynthesis.speak(utterance);
      };

      // Voices load async on first visit — retry once
      if (voicesRef.current.length === 0) {
        loadVoices();
        setTimeout(doSpeak, 250);
      } else {
        doSpeak();
      }
    },
    [voiceEnabled, characters, loadVoices]
  );

  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return {
    speak,
    stop,
    pause,
    resume,
    voiceEnabled,
    setVoiceEnabled,
    voicesReady,
    isSpeaking,
    speechSupported,
  };
}
