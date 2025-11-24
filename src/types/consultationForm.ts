import { z } from 'zod';

/**
 * Zod schema for consultation form validation
 * Used for both client-side and server-side validation
 */
export const consultationFormSchema = z.object({
  name: z.string()
    .min(2, 'Ім\'я має містити мінімум 2 символи')
    .max(255, 'Ім\'я занадто довге')
    .trim(),

  phone: z.string()
    .min(7, 'Введіть номер телефону')
    .max(20, 'Номер телефону занадто довгий')
    .trim()
    .refine(
      val => /^[\d\s\-+()]+$/.test(val) && /\d{7,}/.test(val.replace(/\D/g, '')),
      'Введіть коректний номер телефону'
    ),

  telegram: z.string()
    .regex(/^@?[a-zA-Z0-9_]{3,32}$/, 'Telegram: 3-32 символи (літери, цифри, _)')
    .optional()
    .or(z.literal(''))
    .transform(val => {
      if (!val || val === '') return undefined;
      // Normalize: add @ if not present
      return val.startsWith('@') ? val : `@${val}`;
    }),

  email: z.string()
    .email('Введіть коректну email адресу')
    .max(255, 'Email занадто довгий')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val),
});

/**
 * TypeScript type inferred from Zod schema
 */
export type ConsultationFormData = z.infer<typeof consultationFormSchema>;

/**
 * Form submission state
 */
export interface FormSubmissionState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message?: string;
}
