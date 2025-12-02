import { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { AlertTriangle } from 'lucide-react';

// Import animejs dynamically similar to Home.tsx
let animeInstance: any = null;

const getAnime = async () => {
  if (!animeInstance) {
    const mod: any = await import('animejs');
    animeInstance = mod.default || mod.anime || mod;
  }
  return animeInstance;
};

interface AnimatedConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export default function AnimatedConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}: AnimatedConfirmDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const overlay = overlayRef.current;
    const dialog = dialogRef.current;
    const icon = iconRef.current;
    const content = contentRef.current;

    if (!overlay || !dialog || !icon || !content) return;

    // Initialize animations
    getAnime().then((anime) => {
      // Set initial states
      overlay.style.opacity = '0';
      dialog.style.transform = 'scale(0.8) translate(-50%, -50%) rotate(-5deg)';
      dialog.style.opacity = '0';
      icon.style.transform = 'scale(0) rotate(-180deg)';
      content.style.opacity = '0';
      content.style.transform = 'translateY(20px)';

      // Animate overlay fade in
      anime({
        targets: overlay,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
      });

      // Animate dialog entrance with bounce
      anime({
        targets: dialog,
        scale: [0.8, 1.05, 1],
        rotate: [-5, 2, 0],
        opacity: [0, 1],
        translateY: ['-50%', '-50%'],
        translateX: ['-50%', '-50%'],
        duration: 600,
        delay: 100,
        easing: 'easeOutElastic(1, .8)'
      });

      // Animate icon with rotation and bounce
      anime({
        targets: icon,
        scale: [0, 1.3, 1],
        rotate: [-180, 360, 0],
        duration: 800,
        delay: 300,
        easing: 'easeOutElastic(1, .6)'
      });

      // Animate content fade in
      anime({
        targets: content,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        delay: 400,
        easing: 'easeOutQuad'
      });
    });
  }, [isOpen]);

  const handleConfirm = () => {
    const dialog = dialogRef.current;
    const overlay = overlayRef.current;
    const icon = iconRef.current;

    if (dialog && overlay && icon) {
      getAnime().then((anime) => {
        // Animate icon checkmark spin
        anime({
          targets: icon,
          scale: [1, 1.3, 1.2],
          rotate: [0, 360],
          duration: 500,
          easing: 'easeOutElastic(1, .8)'
        });

        // Animate dialog exit
        anime({
          targets: dialog,
          scale: [1, 0.9],
          opacity: [1, 0],
          translateY: ['-50%', '-40%'],
          duration: 250,
          delay: 200,
          easing: 'easeInQuad',
          complete: () => {
            onConfirm();
            onClose();
          }
        });

        // Animate overlay fade out
        anime({
          targets: overlay,
          opacity: [1, 0],
          duration: 250,
          delay: 200,
          easing: 'easeInQuad'
        });
      });
    } else {
      onConfirm();
      onClose();
    }
  };

  const handleCancel = () => {
    const dialog = dialogRef.current;
    const overlay = overlayRef.current;

    if (dialog && overlay) {
      getAnime().then((anime) => {
        // Animate dialog exit with shake
        anime({
          targets: dialog,
          scale: [1, 0.9],
          opacity: [1, 0],
          translateX: ['-50%', '-50%'],
          translateY: ['-50%', '-40%'],
          rotate: [0, 5],
          duration: 250,
          easing: 'easeInQuad',
          complete: onClose
        });

        // Animate overlay fade out
        anime({
          targets: overlay,
          opacity: [1, 0],
          duration: 250,
          easing: 'easeInQuad'
        });
      });
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
      iconBg: 'bg-red-50',
      buttonClass: 'bg-red-600 hover:bg-red-700 text-white'
    },
    warning: {
      icon: <AlertTriangle className="h-12 w-12 text-yellow-500" />,
      iconBg: 'bg-yellow-50',
      buttonClass: 'bg-yellow-600 hover:bg-yellow-700 text-white'
    },
    info: {
      icon: <AlertTriangle className="h-12 w-12 text-blue-500" />,
      iconBg: 'bg-blue-50',
      buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  };

  const style = variantStyles[variant];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
      onClick={handleCancel}
    >
      <div
        ref={dialogRef}
        className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform"
        style={{ transformOrigin: 'center center' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-4 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          {/* Icon */}
          <div className="flex justify-center pt-6">
            <div
              ref={iconRef}
              className={`flex h-20 w-20 items-center justify-center rounded-full ${style.iconBg} ring-4 ring-white shadow-lg`}
            >
              {style.icon}
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="px-6 pb-6 pt-4 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">{message}</p>

            {/* Buttons */}
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="px-6 py-2.5 font-medium min-w-[100px]"
              >
                {cancelText}
              </Button>
              <Button
                onClick={handleConfirm}
                className={`px-6 py-2.5 font-medium min-w-[100px] ${style.buttonClass} shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

