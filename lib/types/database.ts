export interface Database {
  public: {
    Tables: {
      forms: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          is_active: boolean;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          is_active?: boolean;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          is_active?: boolean;
          expires_at?: string | null;
          created_at?: string;
        };
      };
      form_fields: {
        Row: {
          id: string;
          form_id: string;
          name: string;
          label: string;
          type: string;
          options: any | null;
          position: number;
          required: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          form_id: string;
          name: string;
          label: string;
          type: string;
          options?: any | null;
          position: number;
          required?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          form_id?: string;
          name?: string;
          label?: string;
          type?: string;
          options?: any | null;
          position?: number;
          required?: boolean;
          created_at?: string;
        };
      };
      form_responses: {
        Row: {
          id: string;
          form_id: string;
          responder_id: string | null;
          data: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          form_id: string;
          responder_id?: string | null;
          data: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          form_id?: string;
          responder_id?: string | null;
          data?: any;
          created_at?: string;
        };
      };
    };
  };
}
