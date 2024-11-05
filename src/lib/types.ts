export interface Message {
  type: "user" | "ai";
  content: string;
  queries?: string[];
}

export interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
}

export interface AIResponse {
  question: string;
  response: string;
}

export interface ConversationMessage {
  role: string;
  content: string;
}
