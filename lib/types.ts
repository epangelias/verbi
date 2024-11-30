export interface AIMessage {
  role: string;
  content: string;
  html?: string;
}

export interface OAIOptions {
  baseURL?: string;
  apiKey: string;
  model: string;
}

export interface MailOptions {
  fromName: string;
  toName: string;
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}
