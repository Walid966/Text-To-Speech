import React from 'react';
import Button from './Button';

interface RecordingControlsProps {
  isListening: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  recognitionLang: string;
  onLanguageChange: (lang: string) => void;
  disabled?: boolean;
  isPaused?: boolean;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isListening,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  recognitionLang,
  onLanguageChange,
  disabled = false,
  isPaused = false
}) => {
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!disabled && !isListening) {
      onLanguageChange(e.target.value);
    }
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-4">
      {!isListening && (
        <Button
          onClick={onStartRecording}
          variant="success"
          disabled={disabled}
          title="بدء تسجيل الصوت وتحويله إلى نص"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            بدء التسجيل
          </div>
        </Button>
      )}

      {isListening && !isPaused && (
        <Button
          onClick={onPauseRecording}
          variant="warning"
          disabled={disabled}
          title="إيقاف مؤقت للتسجيل"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            إيقاف مؤقت
          </div>
        </Button>
      )}

      {isListening && isPaused && (
        <Button
          onClick={onResumeRecording}
          variant="success"
          disabled={disabled}
          title="استئناف التسجيل"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            استئناف
          </div>
        </Button>
      )}

      {isListening && (
        <Button
          onClick={onStopRecording}
          variant="danger"
          disabled={disabled}
          title="إيقاف تسجيل الصوت"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
            إيقاف التسجيل
          </div>
        </Button>
      )}

      <select
        className={`px-4 py-3 border border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-300 transition-all duration-300 font-bold text-black bg-white/90 backdrop-blur-sm hover:shadow-md ${
          (disabled || isListening) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        value={recognitionLang}
        onChange={handleLanguageChange}
        disabled={disabled || isListening}
        style={{ fontWeight: 'bold', color: 'black' }}
        title="اختر لغة التسجيل"
      >
        <option value="ar-SA">العربية</option>
        <option value="en-US">الإنجليزية</option>
        <option value="fr-FR">الفرنسية</option>
        <option value="es-ES">الإسبانية</option>
        <option value="de-DE">الألمانية</option>
        <option value="it-IT">الإيطالية</option>
        <option value="ru-RU">الروسية</option>
        <option value="ja-JP">اليابانية</option>
        <option value="ko-KR">الكورية</option>
        <option value="zh-CN">الصينية</option>
      </select>

      {isListening && !isPaused && (
        <div className="flex items-center gap-2 text-green-600 font-bold">
          <div className="animate-pulse h-3 w-3 rounded-full bg-green-600"></div>
          جاري التسجيل...
        </div>
      )}

      {isListening && isPaused && (
        <div className="flex items-center gap-2 text-yellow-600 font-bold">
          <div className="h-3 w-3 rounded-full bg-yellow-600"></div>
          تم إيقاف التسجيل مؤقتاً
        </div>
      )}
    </div>
  );
};

export default RecordingControls; 