import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { z } from 'zod';

// Disable prerendering for this API endpoint (required for hybrid mode)
export const prerender = false;

// Validation schema for consultation form
const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+380\d{9}$/, 'Phone must be in format +380XXXXXXXXX'),
  telegram: z
    .string()
    .regex(/^@?[a-zA-Z0-9_]{5,32}$/, 'Telegram handle must be 5-32 characters')
    .optional()
    .or(z.literal(''))
    .transform((val) => {
      if (!val || val === '') return undefined;
      return val.startsWith('@') ? val : `@${val}`;
    }),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    // Validate all required environment variables (fail fast)
    const apiKey = import.meta.env.RESEND_API_KEY;
    const notificationEmail = import.meta.env.NOTIFICATION_EMAIL;
    const fromEmail = import.meta.env.RESEND_FROM_EMAIL;

    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    if (!notificationEmail) {
      throw new Error('NOTIFICATION_EMAIL environment variable is not set');
    }
    if (!fromEmail) {
      throw new Error('RESEND_FROM_EMAIL environment variable is not set');
    }

    // Initialize Resend
    const resend = new Resend(apiKey);

    // Parse request body
    const body = await request.json();

    // Validate input
    const validatedData = leadSchema.parse(body);

    // Send email notification via Resend
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: notificationEmail,
      replyTo: validatedData.email || undefined,
      subject: `New Consultation Request from ${validatedData.name}`,
      html: `
        <h2>New Consultation Request</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Phone:</strong> ${validatedData.phone}</p>
        ${validatedData.telegram ? `<p><strong>Telegram:</strong> ${validatedData.telegram}</p>` : ''}
        ${validatedData.email ? `<p><strong>Email:</strong> ${validatedData.email}</p>` : ''}
        <p><strong>Source:</strong> consultation_modal</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to send email'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Save to Supabase database
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = import.meta.env.SUPABASE_URL;
    const supabaseKey = import.meta.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL environment variable is not set');
    }
    if (!supabaseKey) {
      throw new Error('SUPABASE_SERVICE_KEY environment variable is not set');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Prepare data for database with metadata
    const leadData = {
      name: validatedData.name,
      phone: validatedData.phone,
      telegram: validatedData.telegram || null,
      email: validatedData.email || null,
      source: 'consultation_modal',
      user_agent: request.headers.get('user-agent') || null,
      referrer: request.headers.get('referer') || null,
    };

    const { data: dbData, error: dbError } = await supabase
      .from('leads')
      .insert([leadData])
      .select('id')
      .single();

    if (dbError) {
      console.error('Supabase error:', dbError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to save lead to database'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you! Your message has been sent.',
        leadId: dbData.id,
        emailId: data?.id
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('API error:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Validation failed',
          details: error.errors
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle other errors
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An unexpected error occurred'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
