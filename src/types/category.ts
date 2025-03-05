export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: number | null;
  color: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoriesResponse {
  status: string;
  message?: string;
  data: Category[];
}

export interface SingleCategoryResponse {
  status: string;
  message?: string;
  data: Category;
}
