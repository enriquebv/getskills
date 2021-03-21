export interface CreateCustomRewardResponseDto {
  broadcaster_name: string;
  broadcaster_login: string;
  broadcaster_id: string;
  id: string;
  image: string;
  background_color: string;
  is_enabled: false;
  cost: number;
  title: string;
  prompt: string;
  is_user_input_required: false;
  max_per_stream_setting: { is_enabled: false; max_per_stream: number };
  max_per_user_per_stream_setting: {
    is_enabled: false;
    max_per_user_per_stream: number;
  };
  global_cooldown_setting: {
    is_enabled: false;
    global_cooldown_seconds: number;
  };
  is_paused: false;
  is_in_stock: false;
  default_image: {
    url_1x: string;
    url_2x: string;
    url_4x: string;
  };
  should_redemptions_skip_request_queue: false;
  redemptions_redeemed_current_stream: number;
  cooldown_expires_at: string;
}
