export interface GetAllCategoriesResponse {
  categories: Categories;
}

export interface Icon {
  height?: number;
  url: string;
  width?: number;
}

export interface GetAllCategoriesResponseItem {
  href: string;
  icons: Icon[];
  id: string;
  name: string;
}

export interface Categories {
  href: string;
  items: GetAllCategoriesResponseItem[];
  limit: number;
  next: string;
  offset: number;
  previous?: any;
  total: number;
}
