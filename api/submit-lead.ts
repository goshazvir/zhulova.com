import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { z } from 'zod';

// Validation schema
const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const validatedData = leadSchema.parse(body);

    // Send email notification via Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@example.com',
      to: process.env.NOTIFICATION_EMAIL || 'admin@example.com',
      replyTo: validatedData.email,
      subject: `New Contact Form Submission from ${validatedData.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
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

    // Save to Supabase (optional - uncomment if needed)
    // const supabase = createClient(
    //   process.env.SUPABASE_URL!,
    //   process.env.SUPABASE_SERVICE_KEY!
    // );
    // await supabase.from('leads').insert([validatedData]);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you! Your message has been sent.',
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
