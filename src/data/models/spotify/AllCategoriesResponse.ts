export interface AllCategoriesResponse {
  categories: Categories;
}

interface Icon {
  height?: number;
  url: string;
  width?: number;
}

export interface Category {
  href: string;
  icons: Icon[];
  id: string;
  name: string;
}

interface Categories {
  href: string;
  items: Category[];
  limit: number;
  next: string;
  offset: number;
  previous?: any;
  total: number;
}
