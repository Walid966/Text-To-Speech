import React from 'react';
import Button from './Button';

interface PlaybackControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onExport: () => void;
  isPaused: boolean;
  isExporting: boolean;
  hasText: boolean;
  disabled?: boolean;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  onPlay,
  onPause,
  onResume,
  onStop,
  onExport,
  isPaused,
  isExporting,
  hasText,
  disabled = false
}) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4">
      <Button
        onClick={onPlay}
        variant="primary"
        disabled={disabled || isExporting || !hasText}
        title="تشغيل النص كصوت"
      >
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          تشغيل
        </div>
      </Button>

      {isPaused ? (
        <Button
          onClick={onResume}
          variant="success"
          disabled={disabled || isExporting}
          title="استئناف التشغيل"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            استئناف
          </div>
        </Button>
      ) : (
        <Button
          onClick={onPause}
          variant="warning"
          disabled={disabled || isExporting}
          title="إيقاف مؤقت للتشغيل"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            إيقاف مؤقت
          </div>
        </Button>
      )}

      <Button
        onClick={onStop}
        variant="danger"
        disabled={disabled || isExporting}
        title="إيقاف التشغيل"
      >
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
          </svg>
          إيقاف
        </div>
      </Button>

      <Button
        onClick={onExport}
        variant="info"
        disabled={disabled || !hasText || isExporting}
        loading={isExporting}
        title="تصدير النص كملف نصي"
      >
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          {isExporting ? 'جاري التصدير...' : 'تصدير النص'}
        </div>
      </Button>
    </div>
  );
};

export default PlaybackControls; 