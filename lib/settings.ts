export interface SiteSettings {
  home_banner_enabled: boolean;
  home_banner_url: string | null;
  site_name: string;
  site_tagline: string;
  site_logo_url: string | null;
  site_favicon_url: string | null;
  about_page_image: string | null;
  about_page_content: string;
  privacy_page_content: string;
  terms_page_content: string;
  social_telegram: string;
  social_discord: string;
  contact_email: string;
  contact_youtube: string;
  contact_vk: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  analytics_ga_id: string;
  analytics_ym_id: string;
  feature_registration_enabled: boolean;
  feature_voting_enabled: boolean;
  feature_server_submission_enabled: boolean;
  maintenance_mode: boolean;
  maintenance_message: string;
  beta_mode: boolean;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: any;
  type: string;
  category: string;
  label: string | null;
  description: string | null;
  history: SettingHistory[];
  current_version: number;
  updated_at: string;
  updated_by: string | null;
  created_at: string;
}

export interface SettingHistory {
  version: number;
  value: any;
  changed_by: string | null;
  changed_at: string;
}

export interface SettingHistoryItem {
  version: number;
  value: any;
  changed_by: string | null;
  changed_at: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  home_banner_enabled: true,
  home_banner_url: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&h=400&fit=crop',
  site_name: 'HytaleServers.tech',
  site_tagline: 'Мониторинг серверов Hytale на русском',
  site_logo_url: null,
  site_favicon_url: null,
  about_page_image: null,
  about_page_content: 'HytaleServers.tech — это лучший мониторинг серверов Hytale на русском языке.',
  privacy_page_content: '',
  terms_page_content: '',
  social_telegram: 'https://t.me/hytaleservers',
  social_discord: '',
  contact_email: 'support@hytaleservers.tech',
  contact_youtube: '',
  contact_vk: '',
  seo_title: 'HytaleServers.tech - Мониторинг серверов Hytale на русском',
  seo_description: 'Найди лучший сервер Hytale на русском языке. Топ серверов, рейтинги, отзывы, онлайн мониторинг.',
  seo_keywords: 'hytale, сервера, мониторинг, top, рейтинг, русский',
  analytics_ga_id: '',
  analytics_ym_id: '',
  feature_registration_enabled: true,
  feature_voting_enabled: true,
  feature_server_submission_enabled: true,
  maintenance_mode: false,
  maintenance_message: 'Сайт временно недоступен. Попробуйте позже.',
  beta_mode: false
};

const SETTINGS_KEYS: Record<keyof SiteSettings, string> = {
  home_banner_enabled: 'home_banner_enabled',
  home_banner_url: 'home_banner_url',
  site_name: 'site_name',
  site_tagline: 'site_tagline',
  site_logo_url: 'site_logo_url',
  site_favicon_url: 'site_favicon_url',
  about_page_image: 'about_page_image',
  about_page_content: 'about_page_content',
  privacy_page_content: 'privacy_page_content',
  terms_page_content: 'terms_page_content',
  social_telegram: 'social_telegram',
  social_discord: 'social_discord',
  contact_email: 'contact_email',
  contact_youtube: 'contact_youtube',
  contact_vk: 'contact_vk',
  seo_title: 'seo_title',
  seo_description: 'seo_description',
  seo_keywords: 'seo_keywords',
  analytics_ga_id: 'analytics_ga_id',
  analytics_ym_id: 'analytics_ym_id',
  feature_registration_enabled: 'feature_registration_enabled',
  feature_voting_enabled: 'feature_voting_enabled',
  feature_server_submission_enabled: 'feature_server_submission_enabled',
  maintenance_mode: 'maintenance_mode',
  maintenance_message: 'maintenance_message',
  beta_mode: 'beta_mode'
};

function mapSettingsToType(settings: SiteSetting[]): SiteSettings {
  const mapped: Partial<SiteSettings> = {};

  settings.forEach((setting) => {
    const settingKey = Object.entries(SETTINGS_KEYS).find(([_, value]) => value === setting.key);
    if (settingKey) {
      const key = settingKey[0] as keyof SiteSettings;
      mapped[key] = setting.value;
    }
  });

  return { ...DEFAULT_SETTINGS, ...mapped };
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const response = await fetch('/api/admin/settings');
    const data = await response.json();

    if (!response.ok) {
      console.error('Failed to fetch settings:', data.error);
      return DEFAULT_SETTINGS;
    }

    return mapSettingsToType(data.settings);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return DEFAULT_SETTINGS;
  }
}
