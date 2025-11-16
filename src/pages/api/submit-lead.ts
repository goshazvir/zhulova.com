import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { consultationFormSchema } from '@/types/consultationForm';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input with Zod
    const validationResult = consultationFormSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Некоректні дані форми',
            details: validationResult.error.format(),
          },
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const leadData = validationResult.data;

    // Initialize Supabase client with service role key
    const supabaseUrl = import.meta.env.SUPABASE_URL;
    const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials');
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Помилка конфігурації сервера',
          },
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert lead into database
    const { data: insertedLead, error: dbError } = await supabase
      .from('leads')
      .insert({
        name: leadData.name,
        phone: leadData.phone,
        telegram: leadData.telegram || null,
        email: leadData.email || null,
        source: 'home_page',
        user_agent: request.headers.get('user-agent'),
        referrer: request.headers.get('referer'),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Помилка при збереженні даних. Спробуйте пізніше.',
          },
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Send email notification via Resend
    const resendApiKey = import.meta.env.RESEND_API_KEY;

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);

        await resend.emails.send({
          from: 'Zhulova Website <noreply@zhulova.com>',
          to: 'vikazhu@gmail.com', // Coach's email
          subject: 'Нова заявка на консультацію',
          html: `
            <h2>Нова заявка на консультацію</h2>
            <p><strong>Ім'я:</strong> ${leadData.name}</p>
            <p><strong>Телефон:</strong> ${leadData.phone}</p>
            ${leadData.telegram ? `<p><strong>Telegram:</strong> ${leadData.telegram}</p>` : ''}
            ${leadData.email ? `<p><strong>Email:</strong> ${leadData.email}</p>` : ''}
            <p><strong>Джерело:</strong> Головна сторінка</p>
            <p><strong>Час:</strong> ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })}</p>
          `,
        });
      } catch (emailError) {
        console.error('Email error:', emailError);
        // Don't fail the request if email fails - lead is already saved
        // Return success but log the email error
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        leadId: insertedLead.id,
        message: 'Дякуємо! Ваша заявка успішно надіслана. Ми зв\'яжемося з вами найближчим часом.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Внутрішня помилка сервера. Спробуйте пізніше.',
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
