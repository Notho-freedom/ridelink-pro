export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      availabilities: {
        Row: {
          city: string
          created_at: string
          date: string
          driver_id: string
          id: string
          is_active: boolean
          lat: number | null
          lng: number | null
          radius_km: number
          seats: number
          time_from: string
          time_to: string
          updated_at: string
          vehicle: string | null
        }
        Insert: {
          city: string
          created_at?: string
          date: string
          driver_id: string
          id?: string
          is_active?: boolean
          lat?: number | null
          lng?: number | null
          radius_km?: number
          seats?: number
          time_from: string
          time_to: string
          updated_at?: string
          vehicle?: string | null
        }
        Update: {
          city?: string
          created_at?: string
          date?: string
          driver_id?: string
          id?: string
          is_active?: boolean
          lat?: number | null
          lng?: number | null
          radius_km?: number
          seats?: number
          time_from?: string
          time_to?: string
          updated_at?: string
          vehicle?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          amount: number
          availability_id: string | null
          created_at: string
          driver_id: string
          id: string
          passenger_id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          seats_booked: number
          status: Database["public"]["Enums"]["booking_status"]
          stripe_session_id: string | null
          trip_id: string | null
          updated_at: string
        }
        Insert: {
          amount?: number
          availability_id?: string | null
          created_at?: string
          driver_id: string
          id?: string
          passenger_id: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          seats_booked?: number
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_session_id?: string | null
          trip_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          availability_id?: string | null
          created_at?: string
          driver_id?: string
          id?: string
          passenger_id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          seats_booked?: number
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_session_id?: string | null
          trip_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_availability_id_fkey"
            columns: ["availability_id"]
            isOneToOne: false
            referencedRelation: "availabilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          booking_id: string
          content: string
          created_at: string
          id: string
          read: boolean
          sender_id: string
        }
        Insert: {
          booking_id: string
          content: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id: string
        }
        Update: {
          booking_id?: string
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          data: Json | null
          id: string
          read: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json | null
          id?: string
          read?: boolean
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json | null
          id?: string
          read?: boolean
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string
        }
        Relationships: []
      }
      ride_requests: {
        Row: {
          created_at: string
          date: string
          from_city: string
          from_lat: number | null
          from_lng: number | null
          id: string
          passenger_id: string
          seats_needed: number
          status: Database["public"]["Enums"]["request_status"]
          time: string | null
          to_city: string
          to_lat: number | null
          to_lng: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          from_city: string
          from_lat?: number | null
          from_lng?: number | null
          id?: string
          passenger_id: string
          seats_needed?: number
          status?: Database["public"]["Enums"]["request_status"]
          time?: string | null
          to_city: string
          to_lat?: number | null
          to_lng?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          from_city?: string
          from_lat?: number | null
          from_lng?: number | null
          id?: string
          passenger_id?: string
          seats_needed?: number
          status?: Database["public"]["Enums"]["request_status"]
          time?: string | null
          to_city?: string
          to_lat?: number | null
          to_lng?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          accepted_payment: Database["public"]["Enums"]["payment_method"]
          created_at: string
          date: string
          departure_time: string
          driver_id: string
          from_address: string | null
          from_city: string
          from_lat: number | null
          from_lng: number | null
          id: string
          price_per_seat: number
          seats_available: number
          status: Database["public"]["Enums"]["trip_status"]
          to_address: string | null
          to_city: string
          to_lat: number | null
          to_lng: number | null
          updated_at: string
          vehicle: string | null
        }
        Insert: {
          accepted_payment?: Database["public"]["Enums"]["payment_method"]
          created_at?: string
          date: string
          departure_time: string
          driver_id: string
          from_address?: string | null
          from_city: string
          from_lat?: number | null
          from_lng?: number | null
          id?: string
          price_per_seat?: number
          seats_available?: number
          status?: Database["public"]["Enums"]["trip_status"]
          to_address?: string | null
          to_city: string
          to_lat?: number | null
          to_lng?: number | null
          updated_at?: string
          vehicle?: string | null
        }
        Update: {
          accepted_payment?: Database["public"]["Enums"]["payment_method"]
          created_at?: string
          date?: string
          departure_time?: string
          driver_id?: string
          from_address?: string | null
          from_city?: string
          from_lat?: number | null
          from_lng?: number | null
          id?: string
          price_per_seat?: number
          seats_available?: number
          status?: Database["public"]["Enums"]["trip_status"]
          to_address?: string | null
          to_city?: string
          to_lat?: number | null
          to_lng?: number | null
          updated_at?: string
          vehicle?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      notification_type:
        | "match"
        | "booking"
        | "message"
        | "request"
        | "payment"
        | "system"
      payment_method: "online" | "cash" | "both"
      payment_status: "pending" | "paid" | "refunded"
      request_status: "open" | "matched" | "cancelled" | "expired"
      trip_status: "active" | "completed" | "cancelled"
      user_type: "driver" | "passenger" | "both"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      notification_type: [
        "match",
        "booking",
        "message",
        "request",
        "payment",
        "system",
      ],
      payment_method: ["online", "cash", "both"],
      payment_status: ["pending", "paid", "refunded"],
      request_status: ["open", "matched", "cancelled", "expired"],
      trip_status: ["active", "completed", "cancelled"],
      user_type: ["driver", "passenger", "both"],
    },
  },
} as const
