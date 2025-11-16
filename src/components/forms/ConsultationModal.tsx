import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUIStore } from '@/stores/uiStore';
import { consultationFormSchema, type ConsultationFormData } from '@/types/consultationForm';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

export default function ConsultationModal() {
  const isOpen = useUIStore((state) => state.isConsultationModalOpen);
  const closeModal = useUIStore((state) => state.closeConsultationModal);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationFormSchema),
  });

  const onSubmit = async (data: ConsultationFormData) => {
    setSubmitStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Помилка при надсиланні форми');
      }

      setSubmitStatus('success');
      reset();

      // Auto-close modal after 3 seconds
      setTimeout(() => {
        closeModal();
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Щось пішло не так. Спробуйте пізніше.');
    }
  };

  const handleClose = () => {
    closeModal();
    // Reset form and status after modal closes
    setTimeout(() => {
      reset();
      setSubmitStatus('idle');
      setErrorMessage('');
    }, 300);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Записатись на консультацію">
      {submitStatus === 'success' ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-green-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-navy-900 mb-2">
            Дякуємо за вашу заявку!
          </h3>
          <p className="text-navy-700">
            Ми зв'яжемося з вами найближчим часом для підтвердження консультації.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <p className="text-navy-700">
            Заповніть форму нижче, і я зв'яжуся з вами для призначення безкоштовної діагностичної сесії.
          </p>

          {/* Name Field */}
          <Input
            label="Ім'я"
            type="text"
            placeholder="Ваше ім'я"
            required
            error={errors.name?.message}
            {...register('name')}
          />

          {/* Phone Field */}
          <Input
            label="Телефон"
            type="tel"
            placeholder="+380501234567"
            required
            helperText="Формат: +380XXXXXXXXX"
            error={errors.phone?.message}
            {...register('phone')}
          />

          {/* Telegram Field */}
          <Input
            label="Telegram"
            type="text"
            placeholder="@username"
            helperText="Необов'язково. Формат: @username"
            error={errors.telegram?.message}
            {...register('telegram')}
          />

          {/* Email Field */}
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            helperText="Необов'язково"
            error={errors.email?.message}
            {...register('email')}
          />

          {/* Error Message */}
          {submitStatus === 'error' && errorMessage && (
            <div
              className="p-4 bg-red-50 border border-red-200 rounded-lg"
              role="alert"
            >
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitStatus === 'submitting'}
              className="flex-1"
            >
              {submitStatus === 'submitting' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Надсилання...
                </span>
              ) : (
                'Відправити заявку'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleClose}
              disabled={submitStatus === 'submitting'}
            >
              Скасувати
            </Button>
          </div>

          {/* Privacy Notice */}
          <p className="text-xs text-navy-600">
            Натискаючи "Відправити заявку", ви погоджуєтесь на обробку ваших персональних даних
            відповідно до нашої політики конфіденційності.
          </p>
        </form>
      )}
    </Modal>
  );
}
