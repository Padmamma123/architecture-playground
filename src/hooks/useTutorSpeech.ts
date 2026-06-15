import { useState, useEffect, useRef, useCallback } from 'react';

const TUTOR_VOICE = { rate: 0.92, pitch: 0.88 };

function pickEnglishVoices(): SpeechSynthesisVoice[] {
  const voices = window.speechSynthesis.getVoices();
  const english = voices.filter((v) => v.lang.startsWith('en'));
  return english.length > 0 ? english : voices;
}

function pickTutorVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  if (!voices.length) return undefined;
  const preferred = voices.find((v) =>
    /google uk english male|microsoft.*david|microsoft.*mark|daniel|google.*english.*male/i.test(v.name)
  );
  return preferred ?? voices.find((v) => /male|david|mark|daniel/i.test(v.name)) ?? voices[0];
}

/** Strip markdown/emojis for cleaner TTS */
export function speechify(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/[🏛️📸👻▶️🎬🎵📱🚪⚖️🖼️🌐📨📰⚡🗄️💬⏱️📖🎬📺⬆️🔄🤖🚫✅💡🔍📋🌍❓🔗👇]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

export function useTutorSpeech() {
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
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (!('speechSynthesis' in window)) {
        onEnd?.();
        return;
      }
      if (!voiceEnabled) return;

      const doSpeak = () => {
        window.speechSynthesis.cancel();
        onEndRef.current = onEnd;

        const utterance = new SpeechSynthesisUtterance(speechify(text));
        const voice = pickTutorVoice(voicesRef.current);
        if (voice) utterance.voice = voice;
        utterance.rate = TUTOR_VOICE.rate;
        utterance.pitch = TUTOR_VOICE.pitch;
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

      if (voicesRef.current.length === 0) {
        loadVoices();
        setTimeout(doSpeak, 250);
      } else {
        doSpeak();
      }
    },
    [voiceEnabled, loadVoices]
  );

  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return {
    speak,
    stop,
    voiceEnabled,
    setVoiceEnabled,
    voicesReady,
    isSpeaking,
    speechSupported,
  };
}

export function buildStepNarration(
  guideName: string,
  stepTitle: string,
  tutorIntro: string,
  problem: string,
  solution: string,
): string {
  return `${guideName}. ${stepTitle}. ${tutorIntro} The problem: ${problem} The solution: ${solution}`;
}
