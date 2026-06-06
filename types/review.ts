export interface ReviewChef {
  id: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl?: string;
}

export interface FeaturedReviewRestaurant {
  id: string;
  name: string;
}

export interface PublicReview {
  _id: string;
  title?: string;
  comment: string;
  createdAt: string;
  updatedAt?: string;
  chef?: ReviewChef;
  restaurant?: FeaturedReviewRestaurant;
}

export interface FeaturedReviewsResponse {
  success: boolean;
  count: number;
  data: PublicReview[];
}

export interface ReviewSummary {
  reviewCount: number;
}

export interface RestaurantReviewsResponse {
  success: boolean;
  count: number;
  page?: number;
  limit?: number;
  data: PublicReview[];
}

export interface ReviewSummaryResponse {
  success: boolean;
  data: ReviewSummary;
}

export interface SubmitReviewResponse {
  success: boolean;
  data: {
    _id: string;
    restaurantId: string;
    comment: string;
    status: string;
  };
  flagged?: boolean;
  message?: string;
}

export interface MyReviewRestaurant {
  id: string;
  name: string;
  city?: string;
  state?: string;
}

export interface MyReview {
  _id: string;
  title?: string;
  comment: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  restaurant?: MyReviewRestaurant;
}

export interface MyReviewsResponse {
  success: boolean;
  count: number;
  data: MyReview[];
}
