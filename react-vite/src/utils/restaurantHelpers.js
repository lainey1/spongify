export const getAvgStarRating = (reviewStats) =>
  reviewStats?.avgStarRating || 0;

export const getReviewCount = (reviewStats) => reviewStats?.reviewCount || 0;

export const formatStarRating = (rating) =>
  rating > 0 ? Number(rating).toFixed(1) : "New";

export const formatReviewCount = (count) =>
  count > 0 ? `(${count} ${count === 1 ? "Review" : "Reviews"})` : "";
