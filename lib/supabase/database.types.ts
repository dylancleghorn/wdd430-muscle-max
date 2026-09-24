export type Database = {
  public: {
    Tables: {
      completed_sets: {
        Row: {
          actual_reps: number;
          actual_sets: number;
          actual_weight: number | null;
          display_order: number;
          exercise_name: string;
          id: string;
          session_id: string;
        };
        Insert: {
          actual_reps: number;
          actual_sets: number;
          actual_weight?: number | null;
          display_order?: number;
          exercise_name: string;
          id?: string;
          session_id: string;
        };
        Update: {
          actual_reps?: number;
          actual_sets?: number;
          actual_weight?: number | null;
          display_order?: number;
          exercise_name?: string;
          id?: string;
          session_id?: string;
        };
        Relationships: [];
      };
      routine_exercises: {
        Row: {
          created_at: string;
          display_order: number;
          id: string;
          name: string;
          planned_reps: number;
          planned_sets: number;
          planned_weight: number | null;
          routine_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_order?: number;
          id?: string;
          name: string;
          planned_reps: number;
          planned_sets: number;
          planned_weight?: number | null;
          routine_id: string;
          updated_at?: string;
        };
        Update: {
          display_order?: number;
          name?: string;
          planned_reps?: number;
          planned_sets?: number;
          planned_weight?: number | null;
          routine_id?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          image_url: string | null;
          name: string | null;
          updated_at: string;
        };
        Insert: {
          email: string;
          id: string;
          image_url?: string | null;
          name?: string | null;
        };
        Update: {
          email?: string;
          image_url?: string | null;
          name?: string | null;
        };
        Relationships: [];
      };
      workout_routines: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          notes: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          notes?: string | null;
          user_id: string;
        };
        Update: {
          name?: string;
          notes?: string | null;
        };
        Relationships: [];
      };
      workout_sessions: {
        Row: {
          completed_at: string;
          created_at: string;
          id: string;
          notes: string | null;
          routine_id: string | null;
          user_id: string;
        };
        Insert: {
          completed_at?: string;
          id?: string;
          notes?: string | null;
          routine_id?: string | null;
          user_id: string;
        };
        Update: {
          completed_at?: string;
          notes?: string | null;
          routine_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
