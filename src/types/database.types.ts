/**
 * Handwritten Supabase database types.
 *
 * Mirrors `supabase/migrations/0001_init_schema.sql`. When schema changes,
 * update this file by hand or regenerate via `pnpm db:types` (requires Docker
 * and a linked Supabase project).
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type RegistrationStatus =
  | "baru"
  | "dihubungi"
  | "trial"
  | "daftar"
  | "tidak_lanjut";

export type ClassType = "privat" | "semi_privat" | "grup" | "belum_yakin";

export type ArticleStatus = "draft" | "published";

export type TestimonialStatus = "draft" | "published";

export type StudentGender = "laki_laki" | "perempuan";

export type StudentExperience =
  | "belum_bisa"
  | "sedikit_bisa"
  | "sudah_bisa_dasar"
  | "mahir";

export type Database = {
  public: {
    Tables: {
      registrations: {
        Row: {
          id: string;
          display_id: string;
          student_name: string;
          student_age: number;
          student_gender: StudentGender;
          student_experience: StudentExperience;
          preferred_class_type: ClassType;
          preferred_schedule: string | null;
          preferred_location: string | null;
          parent_name: string;
          parent_whatsapp: string;
          parent_email: string | null;
          notes: string | null;
          status: RegistrationStatus;
          internal_notes: string | null;
          contacted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          display_id?: string;
          student_name: string;
          student_age: number;
          student_gender: StudentGender;
          student_experience: StudentExperience;
          preferred_class_type: ClassType;
          preferred_schedule?: string | null;
          preferred_location?: string | null;
          parent_name: string;
          parent_whatsapp: string;
          parent_email?: string | null;
          notes?: string | null;
          status?: RegistrationStatus;
          internal_notes?: string | null;
          contacted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_id?: string;
          student_name?: string;
          student_age?: number;
          student_gender?: StudentGender;
          student_experience?: StudentExperience;
          preferred_class_type?: ClassType;
          preferred_schedule?: string | null;
          preferred_location?: string | null;
          parent_name?: string;
          parent_whatsapp?: string;
          parent_email?: string | null;
          notes?: string | null;
          status?: RegistrationStatus;
          internal_notes?: string | null;
          contacted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: Json;
          content_html: string;
          cover_image_url: string;
          cover_image_alt: string;
          category_id: string | null;
          author_name: string;
          reading_time_minutes: number;
          status: ArticleStatus;
          seo_title: string | null;
          seo_description: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt: string;
          content: Json;
          content_html: string;
          cover_image_url: string;
          cover_image_alt: string;
          category_id?: string | null;
          author_name?: string;
          reading_time_minutes?: number;
          status?: ArticleStatus;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string;
          content?: Json;
          content_html?: string;
          cover_image_url?: string;
          cover_image_alt?: string;
          category_id?: string | null;
          author_name?: string;
          reading_time_minutes?: number;
          status?: ArticleStatus;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          role: string | null;
          rating: number;
          text: string;
          photo_url: string | null;
          featured: boolean;
          status: TestimonialStatus;
          display_order: number;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          role?: string | null;
          rating: number;
          text: string;
          photo_url?: string | null;
          featured?: boolean;
          status?: TestimonialStatus;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string | null;
          rating?: number;
          text?: string;
          photo_url?: string | null;
          featured?: boolean;
          status?: TestimonialStatus;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      registration_status: RegistrationStatus;
      class_type: ClassType;
      article_status: ArticleStatus;
      testimonial_status: TestimonialStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
