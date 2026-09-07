export type Profile = {
  id: string; user_id: string; slug: string; display_name: string; first_name: string | null; last_name: string | null;
  headline: string | null; bio: string | null; avatar_url: string | null; banner_url: string | null; company: string | null;
  job_title: string | null; location: string | null; email_public: string | null; phone_public: string | null; website: string | null;
  published: boolean; show_branding: boolean; plan: 'free' | 'pro'; onboarding_completed: boolean; qr_downloaded_at: string | null;
  created_at: string; updated_at: string;
};

export type SocialLink = { id: string; profile_id: string; platform: string; label: string | null; url: string; username: string | null; position: number; enabled: boolean; created_at: string; updated_at: string };
export type Appearance = { id: string; profile_id: string; theme: string; background_type: 'color' | 'gradient' | 'image'; background_value: string; accent_color: string; text_color: string; card_opacity: number; card_blur: number; card_radius: number; button_style: string; avatar_shape: string; font_family: string; animation_style: string; animation_enabled: boolean; show_banner: boolean; created_at: string; updated_at: string };
export type SlugAlias = { slug: string; profile_id: string; created_at: string };
export type QardData = { profile: Profile; links: SocialLink[]; appearance: Appearance };

export type Database = {
  public: {
    Tables: {
      qard_profiles: { Row: Profile; Insert: Partial<Profile> & Pick<Profile, 'user_id' | 'slug' | 'display_name'>; Update: Partial<Profile>; Relationships: [] };
      qard_social_links: { Row: SocialLink; Insert: Omit<SocialLink, 'id' | 'created_at' | 'updated_at'> & { id?: string }; Update: Partial<SocialLink>; Relationships: [] };
      qard_appearance: { Row: Appearance; Insert: Partial<Appearance> & Pick<Appearance, 'profile_id'>; Update: Partial<Appearance>; Relationships: [] };
      qard_slug_aliases: { Row: SlugAlias; Insert: Pick<SlugAlias, 'slug' | 'profile_id'> & Partial<Pick<SlugAlias, 'created_at'>>; Update: never; Relationships: [] };
      qard_analytics_events: { Row: { id: number; profile_id: string; social_link_id: string | null; event_type: string; referrer: string | null; device_type: string | null; browser: string | null; country: string | null; created_at: string }; Insert: { profile_id: string; social_link_id?: string | null; event_type: string; referrer?: string | null; device_type?: string | null; browser?: string | null; country?: string | null }; Update: never; Relationships: [] };
      qard_subscriptions: { Row: { id: string; user_id: string; plan: 'free' | 'pro'; status: string; provider: string; provider_customer_id: string | null; provider_subscription_id: string | null; current_period_end: string | null; created_at: string; updated_at: string }; Insert: never; Update: never; Relationships: [] };
    };
    Views: Record<string, never>; Functions: Record<string, never>; Enums: { qard_plan: 'free' | 'pro'; analytics_event_type: 'profile_view' | 'link_click' | 'contact_download' | 'qr_download'; subscription_status: 'inactive' | 'trialing' | 'active' | 'past_due' | 'canceled' }; CompositeTypes: Record<string, never>;
  };
};
