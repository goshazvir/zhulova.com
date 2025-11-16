/**
 * Lead record as stored in database
 */
export interface LeadRecord {
  id: string;
  name: string;
  phone: string;
  telegram: string | null;
  email: string | null;
  source: string;
  user_agent: string | null;
  referrer: string | null;
  created_at: string;  // ISO 8601 timestamp
  updated_at: string;  // ISO 8601 timestamp
}

/**
 * Data required to create a new lead
 * Omits auto-generated fields (id, timestamps)
 */
export interface CreateLeadInput {
  name: string;
  phone: string;
  telegram?: string | null;
  email?: string | null;
  source?: string;
  user_agent?: string | null;
  referrer?: string | null;
}

/**
 * API response for lead creation
 */
export interface CreateLeadResponse {
  success: boolean;
  leadId?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
