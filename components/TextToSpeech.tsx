'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import RecordingControls from './RecordingControls';
import PlaybackControls from './PlaybackControls';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
    length: number;
    isFinal?: boolean;
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
}

interface VoiceOption {
  name: string;
  lang: string;
  localName?: string;
  default?: boolean;
}

interface SpeechSynthesisVoiceExtended extends SpeechSynthesisVoice {
  localName?: string;
}

interface EventTarget {
  value: string;
}

interface DataAvailableEvent extends Event {
  data: Blob;
}

// تعريف أسماء اللغات بالعربية
const languageNames: { [key: string]: string } = {
  'ar': 'العربية',
  'en': 'الإنجليزية',
  'fr': 'الفرنسية',
  'es': 'الإسبانية',
  'de': 'الألمانية',
  'it': 'الإيطالية',
  'ru': 'الروسية',
  'ja': 'اليابانية',
  'ko': 'الكورية',
  'zh': 'الصينية',
  'hi': 'الهندية',
  'tr': 'التركية',
  'pt': 'البرتغالية',
  'nl': 'الهولندية',
  'pl': 'البولندية',
  'sv': 'السويدية',
  'da': 'الدنماركية',
  'fi': 'الفنلندية',
  'no': 'النرويجية',
  'cs': 'التشيكية',
  'el': 'اليونانية',
  'he': 'العبرية',
  'id': 'الإندونيسية',
  'th': 'التايلاندية',
  'vi': 'الفيتنامية',
  'ro': 'الرومانية',
  'hu': 'المجرية',
  'uk': 'الأوكرانية',
};

export default function TextToSpeech() {
  const [text, setText] = useState<string>('');
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognitionLang, setRecognitionLang] = useState<string>('ar-SA');
  const synth = useRef<SpeechSynthesis | null>(null);
  const recognition = useRef<SpeechRecognition | null>(null);
  const [isRecordingPaused, setIsRecordingPaused] = useState<boolean>(false);

  // إضافة دعم تحويل الصوت إلى نص
  useEffect(() => {
    let recognitionInstance: SpeechRecognition | null = null;

    if (typeof window !== 'undefined') {
      // @ts-expect-error Web Speech API types not fully supported
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionInstance = new SpeechRecognition();
        if (recognitionInstance) {
          recognitionInstance.continuous = true;
          recognitionInstance.interimResults = true;
          recognition.current = recognitionInstance;
          
          recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
            const results = event.results;
            const lastResult = results[results.length - 1];
            if (Array.isArray(lastResult) && lastResult[0] && 'transcript' in lastResult[0]) {
              const transcript = lastResult[0].transcript;
              setText((prevText) => prevText ? `${prevText} ${transcript}` : transcript);
            }
          };

          recognitionInstance.onerror = (event: Event) => {
            console.error('خطأ في التعرف على الصوت:', event);
            setIsListening(false);
            setIsRecordingPaused(false);
            alert('حدث خطأ في التعرف على الصوت. يرجى المحاولة مرة أخرى.');
          };

          recognitionInstance.onend = () => {
            if (isListening && !isRecordingPaused && recognitionInstance) {
              try {
                recognitionInstance.start();
              } catch (err) {
                console.error('خطأ في إعادة تشغيل التعرف على الصوت:', err);
                setIsListening(false);
                setIsRecordingPaused(false);
              }
            }
          };
        }
      }
    }

    return () => {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (err) {
          console.error('خطأ في إيقاف التسجيل عند التنظيف:', err);
        }
        setIsListening(false);
        setIsRecordingPaused(false);
      }
    };
  }, [isListening, isRecordingPaused]);

  const toggleListening = () => {
    if (!recognition.current) {
      alert('متصفحك لا يدعم ميزة التعرف على الصوت. يرجى استخدام Google Chrome.');
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    setText('');
    recognition.current.lang = recognitionLang;
    
    try {
      recognition.current.start();
      setIsListening(true);
      setIsRecordingPaused(false);
    } catch (err) {
      console.error('خطأ في بدء التعرف على الصوت:', err);
      setIsListening(false);
      setIsRecordingPaused(false);
      alert('حدث خطأ في بدء التعرف على الصوت. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
    }
  };

  const stopListening = () => {
    if (!recognition.current || !isListening) return;

    try {
      recognition.current.stop();
    } catch (err) {
      console.error('خطأ في إيقاف التسجيل:', err);
    } finally {
      setIsListening(false);
      setIsRecordingPaused(false);
    }
  };

  const pauseRecording = () => {
    if (!recognition.current || !isListening || isRecordingPaused) return;

    try {
      recognition.current.stop();
      setIsRecordingPaused(true);
    } catch (err) {
      console.error('خطأ في إيقاف التسجيل مؤقتاً:', err);
      setIsRecordingPaused(false);
    }
  };

  const resumeRecording = () => {
    if (!recognition.current || !isListening || !isRecordingPaused) return;

    try {
      recognition.current.start();
      setIsRecordingPaused(false);
    } catch (err) {
      console.error('خطأ في استئناف التسجيل:', err);
      setIsListening(false);
      setIsRecordingPaused(false);
    }
  };

  // تجميع الأصوات حسب اللغة
  const voicesByLanguage = useMemo(() => {
    const grouped: { [key: string]: VoiceOption[] } = {};
    voices.forEach((voice: VoiceOption) => {
      const langCode = voice.lang.split('-')[0];
      if (!grouped[langCode]) {
        grouped[langCode] = [];
      }
      grouped[langCode].push({
        ...voice,
        localName: languageNames[langCode] || voice.lang
      });
    });
    return grouped;
  }, [voices]);

  // الحصول على قائمة اللغات المتوفرة
  const availableLanguages = useMemo(() => {
    return Object.keys(voicesByLanguage).map(langCode => ({
      code: langCode,
      name: languageNames[langCode] || langCode
    }));
  }, [voicesByLanguage]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synth.current = window.speechSynthesis;
      const updateVoices = () => {
        const availableVoices = synth.current!.getVoices();
        console.log('Available voices:', availableVoices);
        
        const mappedVoices = availableVoices.map((voice: SpeechSynthesisVoice): VoiceOption => ({
          name: voice.name,
          lang: voice.lang,
          default: voice.default
        }));
        
        setVoices(mappedVoices);
        
        const arabicVoice = mappedVoices.find((voice: VoiceOption) => 
          voice.lang.toLowerCase().includes('ar') || 
          voice.name.toLowerCase().includes('arab')
        );
        
        if (arabicVoice) {
          setSelectedVoice(arabicVoice.name);
          setSelectedLanguage('ar');
        } else {
          const defaultVoice = mappedVoices.find((voice: VoiceOption) => voice.default) || mappedVoices[0];
          if (defaultVoice) {
            setSelectedVoice(defaultVoice.name);
            setSelectedLanguage(defaultVoice.lang.split('-')[0]);
          }
        }
      };
      
      synth.current.onvoiceschanged = updateVoices;
      updateVoices();
    }
  }, []);

  // تصفية الأصوات حسب اللغة المحددة
  const filteredVoices = useMemo(() => {
    if (selectedLanguage === 'all') return voices;
    return voices.filter((voice: VoiceOption) => voice.lang.startsWith(selectedLanguage));
  }, [voices, selectedLanguage]);

  const speak = () => {
    if (synth.current && text) {
      synth.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = synth.current.getVoices().find((v: SpeechSynthesisVoice) => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      }
      utterance.rate = rate;
      utterance.pitch = pitch;
      synth.current.speak(utterance);
      setIsPaused(false);
    }
  };

  const pause = () => {
    if (synth.current) {
      synth.current.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (synth.current) {
      synth.current.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    if (synth.current) {
      synth.current.cancel();
      setIsPaused(true);
    }
  };

  const exportToMp3 = async () => {
    if (!text || !synth.current) return;

    try {
      setIsExporting(true);

      // إنشاء رابط تنزيل مباشر
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `text-to-speech-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      alert('تم تصدير النص بنجاح!');

    } catch (error: unknown) {
      console.error('خطأ في تصدير النص:', error);
      setIsExporting(false);
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء تصدير الملف. يرجى المحاولة مرة أخرى.';
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient"></div>
      
      <div className="relative max-w-4xl mx-auto p-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-text">
            محول النص إلى صوت والعكس
          </h1>
          <p className="text-gray-600 text-lg">حول نصوصك إلى صوت أو العكس بأكثر من 25 لغة عالمية</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-8 border border-white/20 hover:shadow-purple-200/50 transition-all duration-500">
          {voices.length === 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    لم يتم العثور على أصوات متاحة. يرجى التأكد من:
                    <br />
                    1. استخدام متصفح حديث (يفضل Google Chrome)
                    <br />
                    2. تثبيت حزم الأصوات في نظام التشغيل
                    <br />
                    3. السماح للموقع باستخدام ميزة تحويل النص إلى صوت
                  </p>
                </div>
              </div>
            </div>
          )}

          <textarea
            className="w-full h-48 p-6 border-2 border-purple-100 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-300 transition-all duration-300 ease-in-out text-lg font-bold text-black bg-white/90 backdrop-blur-sm resize-none hover:shadow-lg"
            value={text}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
            placeholder="أدخل النص هنا..."
            dir="auto"
            style={{ fontWeight: 'bold', color: 'black' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
              <label className="block text-base font-bold text-gray-800">اختر اللغة:</label>
              <select
                className="w-full p-4 border border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-300 transition-all duration-300 font-bold text-black bg-white/90 backdrop-blur-sm hover:shadow-md"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                style={{ fontWeight: 'bold', color: 'black' }}
              >
                <option value="all">جميع اللغات ({voices.length} صوت)</option>
                {availableLanguages.map(({ code, name }) => {
                  const count = voices.filter(v => v.lang.startsWith(code)).length;
                  return (
                    <option key={code} value={code} className="font-bold text-black">
                      {name} ({count} صوت)
                    </option>
                  );
                })}
              </select>
              {!voices.some(v => v.lang.includes('ar')) && (
                <p className="text-sm text-yellow-600 mt-2">
                  ملاحظة: اللغة العربية غير متوفرة حالياً في متصفحك. جرب تثبيت حزمة الأصوات العربية أو استخدام متصفح آخر.
                </p>
              )}
            </div>

            <div className="space-y-4 bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
              <label className="block text-base font-bold text-gray-800">اختر الصوت:</label>
              <select
                className="w-full p-4 border border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-300 transition-all duration-300 font-bold text-black bg-white/90 backdrop-blur-sm hover:shadow-md"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                style={{ fontWeight: 'bold', color: 'black' }}
              >
                {filteredVoices.map((voice) => {
                  const langCode = voice.lang.split('-')[0];
                  const localName = languageNames[langCode] || voice.lang;
                  return (
                    <option key={voice.name} value={voice.name} className="font-bold text-black">
                      {localName} - {voice.name}
                    </option>
                  );
                })}
              </select>
              <p className="text-sm text-purple-600 mt-2 font-medium">
                {filteredVoices.length === 0 ? "جاري تحميل الأصوات المتاحة..." : `${filteredVoices.length} صوت متاح`}
              </p>
            </div>

            <div className="space-y-4 bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
              <label className="block text-base font-bold text-gray-800">السرعة: {rate}x</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-sm text-purple-600">
                <span>0.5x</span>
                <span>2x</span>
              </div>
            </div>

            <div className="space-y-4 bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
              <label className="block text-base font-bold text-gray-800">طبقة الصوت: {pitch}</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-sm text-purple-600">
                <span>منخفض</span>
                <span>مرتفع</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            <RecordingControls
              isListening={isListening}
              onStartRecording={toggleListening}
              onStopRecording={stopListening}
              onPauseRecording={pauseRecording}
              onResumeRecording={resumeRecording}
              recognitionLang={recognitionLang}
              onLanguageChange={(lang) => setRecognitionLang(lang)}
              isPaused={isRecordingPaused}
            />

            <PlaybackControls
              onPlay={speak}
              onPause={pause}
              onResume={resume}
              onStop={stop}
              onExport={exportToMp3}
              isPaused={isPaused}
              isExporting={isExporting}
              hasText={!!text}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, #6366f1 1px, transparent 1px);
          background-size: 30px 30px;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 15s ease infinite;
          background-size: 400% 400%;
        }
        .animate-gradient-text {
          animation: gradient 3s ease infinite;
          background-size: 200% auto;
        }
      `}</style>
    </div>
  );
} 