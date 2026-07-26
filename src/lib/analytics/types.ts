export type AnalyticsEvent = 
  | 'generate_lead' 
  | 'view_item' 
  | 'view_item_list' 
  | 'search' 
  | 'contact_us' 
  | 'article_view';

export interface AnalyticsPayload {
  generate_lead: {
    currency?: string;
    value?: number;
    item_id?: string;
    item_name?: string;
    lead_source: 'whatsapp_button' | 'contact_form' | 'product_cta' | 'article_cta';
  };
  view_item: {
    currency?: string;
    value?: number;
    items: Array<{
      item_id: string;
      item_name: string;
      item_category?: string;
      price?: number;
    }>;
  };
  view_item_list: {
    item_list_id?: string;
    item_list_name?: string;
    items: Array<{
      item_id: string;
      item_name: string;
    }>;
  };
  search: {
    search_term: string;
  };
  contact_us: {
    method: 'whatsapp' | 'email' | 'phone';
  };
  article_view: {
    article_title: string;
    article_category: string;
  };
}
