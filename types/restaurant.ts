export interface ContentSection {
  _id?: string;
  heading: string;
  body?: string;
  images?: string[];
  order?: number;
}

export interface PublicRestaurant {
  _id: string;
  name: string;
  description?: string;
  cuisine?: string;
  phone?: string;
  website?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  images?: string[];
  contentSections?: ContentSection[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PublicRestaurantListResponse {
  success: boolean;
  count: number;
  data: PublicRestaurant[];
}

export interface PublicRestaurantResponse {
  success: boolean;
  data: PublicRestaurant;
}
