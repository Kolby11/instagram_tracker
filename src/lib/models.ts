export type BioLink = {
  title: string;
  lynx_url: string;
  url: string;
  link_type: string;
};

export type BiographyWithEntities = {
  raw_text: string;
  entities: unknown[];
};

export type EdgeFollowedBy = {
  count: number;
};

export type EdgeFollow = {
  count: number;
};

export type EdgeMutualFollowedBy = {
  count: number;
  edges: unknown[];
};

export type PageInfo = {
  has_next_page: boolean;
  end_cursor: string | null;
};

export type EdgeFelixVideoTimeline = {
  count: number;
  page_info: PageInfo;
  edges: unknown[];
};

export type EdgeOwnerToTimelineMedia = {
  count: number;
  page_info: PageInfo;
  edges: unknown[];
};

export type EdgeSavedMedia = {
  count: number;
  page_info: PageInfo;
  edges: unknown[];
};

export type EdgeMediaCollections = {
  count: number;
  page_info: PageInfo;
  edges: unknown[];
};

export type EdgeRelatedProfiles = {
  edges: unknown[];
};

export type UserDetail = {
  ai_agent_type: null;
  biography: string;
  bio_links: BioLink[];
  fb_profile_biolink: null;
  biography_with_entities: BiographyWithEntities;
  blocked_by_viewer: boolean;
  restricted_by_viewer: null;
  country_block: boolean;
  eimu_id: string;
  external_url: string;
  external_url_linkshimmed: string;
  edge_followed_by: EdgeFollowedBy;
  fbid: string;
  followed_by_viewer: boolean;
  edge_follow: EdgeFollow;
  follows_viewer: boolean;
  full_name: string;
  group_metadata: null;
  has_ar_effects: boolean;
  has_clips: boolean;
  has_guides: boolean;
  has_channel: boolean;
  has_blocked_viewer: boolean;
  highlight_reel_count: number;
  has_onboarded_to_text_post_app: boolean;
  has_requested_viewer: boolean;
  hide_like_and_view_counts: boolean;
  id: string;
  is_business_account: boolean;
  is_professional_account: boolean;
  is_supervision_enabled: boolean;
  is_guardian_of_viewer: boolean;
  is_supervised_by_viewer: boolean;
  is_supervised_user: boolean;
  is_embeds_disabled: boolean;
  is_joined_recently: boolean;
  guardian_id: null;
  business_address_json: null;
  business_contact_method: string;
  business_email: null;
  business_phone_number: null;
  business_category_name: null;
  overall_category_name: null;
  category_enum: null;
  category_name: null;
  is_private: boolean;
  is_verified: boolean;
  is_verified_by_mv4b: boolean;
  is_regulated_c18: boolean;
  edge_mutual_followed_by: EdgeMutualFollowedBy;
  pinned_channels_list_count: number;
  profile_pic_url: string;
  profile_pic_url_hd: string;
  requested_by_viewer: boolean;
  should_show_category: boolean;
  should_show_public_contacts: boolean;
  show_account_transparency_details: boolean;
  show_text_post_app_badge: null;
  remove_message_entrypoint: boolean;
  transparency_label: null;
  transparency_product: null;
  username: string;
  connected_fb_page: null;
  pronouns: unknown[];
  edge_felix_video_timeline: EdgeFelixVideoTimeline;
  edge_owner_to_timeline_media: EdgeOwnerToTimelineMedia;
  edge_saved_media: EdgeSavedMedia;
  edge_media_collections: EdgeMediaCollections;
  edge_related_profiles: EdgeRelatedProfiles;
};

export type UserPreview = {
  pk: string;
  pk_id: string;
  id: number;
  username: string;
  full_name: string;
  is_private: boolean;
  fbid_v2: string;
  third_party_downloads_enabled: number;
  strong_id__: string;
  profile_pic_id: string;
  profile_pic_url: string;
  is_verified: boolean;
  has_anonymous_profile_picture: boolean;
  account_badges: unknown[];
  latest_reel_media: number;
  is_favorite: boolean;
};