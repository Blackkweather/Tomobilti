import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  reviewerName: string;
  revieweeName: string;
  rating: number;
  comment: string;
  type: "renter_to_owner" | "owner_to_renter";
  car?: {
    make: string;
    model: string;
    year: number;
  };
  createdAt: string;
  response?: string;
}

interface ReviewForm {
  rating: number;
  comment: string;
}

export default function Reviews() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"received" | "given">("received");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const { data: receivedReviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/reviews/received"],
  });

  const { data: givenReviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/reviews/given"],
  });

  const replyMutation = useMutation({
    mutationFn: async ({ reviewId, response }: { reviewId: string; response: string }) => {
      await apiRequest("POST", `/api/reviews/${reviewId}/reply`, { response });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/received"] });
      setReplyingTo(null);
      setReplyText("");
    },
  });

  const handleReply = (reviewId: string) => {
    if (replyText.trim()) {
      replyMutation.mutate({ reviewId, response: replyText });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const averageRating = receivedReviews.length > 0 
    ? receivedReviews.reduce((sum, review) => sum + review.rating, 0) / receivedReviews.length 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
          {receivedReviews.length > 0 && (
            <div className="mt-4 flex items-center justify-center">
              <div className="flex items-center">
                {renderStars(Math.round(averageRating))}
                <span className="ml-2 text-lg font-medium text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
                <span className="ml-1 text-gray-600">
                  ({receivedReviews.length} review{receivedReviews.length !== 1 ? 's' : ''})
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("received")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "received"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Reviews Received ({receivedReviews.length})
              </button>
              <button
                onClick={() => setActiveTab("given")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "given"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Reviews Given ({givenReviews.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "received" ? (
              <div className="space-y-6">
                {receivedReviews.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Reviews from renters and owners will appear here.
                    </p>
                  </div>
                ) : (
                  receivedReviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {review.reviewerName}
                            </h3>
                            <span className="ml-2 text-sm text-gray-500">
                              {review.type === "renter_to_owner" ? "Renter" : "Owner"}
                            </span>
                          </div>
                          <div className="flex items-center mb-2">
                            {renderStars(review.rating)}
                            <span className="ml-2 text-sm text-gray-600">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          {review.car && (
                            <p className="text-sm text-gray-600">
                              {review.car.year} {review.car.make} {review.car.model}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{review.comment}</p>
                      
                      {review.response && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-sm font-medium text-gray-900 mb-2">Your Response:</p>
                          <p className="text-gray-700">{review.response}</p>
                        </div>
                      )}
                      
                      {!review.response && (
                        <div>
                          {replyingTo === review.id ? (
                            <div className="space-y-3">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write your response..."
                                rows={3}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleReply(review.id)}
                                  disabled={!replyText.trim() || replyMutation.isPending}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                                >
                                  {replyMutation.isPending ? "Posting..." : "Post Response"}
                                </button>
                                <button
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyText("");
                                  }}
                                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setReplyingTo(review.id)}
                              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                            >
                              Reply to this review
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {givenReviews.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews given</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Reviews you've written will appear here.
                    </p>
                  </div>
                ) : (
                  givenReviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              Review for {review.revieweeName}
                            </h3>
                            <span className="ml-2 text-sm text-gray-500">
                              {review.type === "renter_to_owner" ? "Owner" : "Renter"}
                            </span>
                          </div>
                          <div className="flex items-center mb-2">
                            {renderStars(review.rating)}
                            <span className="ml-2 text-sm text-gray-600">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          {review.car && (
                            <p className="text-sm text-gray-600">
                              {review.car.year} {review.car.make} {review.car.model}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-700">{review.comment}</p>
                      
                      {review.response && (
                        <div className="bg-gray-50 rounded-lg p-4 mt-4">
                          <p className="text-sm font-medium text-gray-900 mb-2">Their Response:</p>
                          <p className="text-gray-700">{review.response}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}