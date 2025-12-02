import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Star, 
  Shield, 
  ThumbsUp, 
  Flag, 
  CheckCircle,
  Car,
  Calendar
} from 'lucide-react';

interface Review {
  id: string;
  reviewerName: string;
  reviewerImage?: string;
  reviewerType: 'owner' | 'renter';
  rating: number;
  securityRating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  reported: boolean;
  carTitle?: string;
  bookingDate?: string;
}

interface SecurityReviewsProps {
  reviews: Review[];
  userType: 'owner' | 'renter';
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'verified' | 'helpful' | 'reported'>) => void;
  onReportReview: (reviewId: string) => void;
  onHelpfulReview: (reviewId: string) => void;
}

export default function SecurityReviews({ 
  reviews, 
  userType, 
  onAddReview, 
  onReportReview, 
  onHelpfulReview 
}: SecurityReviewsProps) {
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    securityRating: 5,
    title: '',
    comment: '',
    carTitle: '',
    bookingDate: ''
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  
  const averageSecurityRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.securityRating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(review => review.rating === star).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(review => review.rating === star).length / reviews.length) * 100 
      : 0
  }));

  const handleSubmitReview = () => {
    onAddReview({
      reviewerName: 'Current User',
      reviewerType: userType,
      ...newReview
    });
    setNewReview({
      rating: 5,
      securityRating: 5,
      title: '',
      comment: '',
      carTitle: '',
      bookingDate: ''
    });
    setShowAddReview(false);
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getSecurityBadge = (rating: number) => {
    if (rating >= 4.5) return { text: 'Excellent Security', variant: 'default' as const, color: 'text-white' };
    if (rating >= 3.5) return { text: 'Good Security', variant: 'secondary' as const, color: 'text-blue-600' };
    if (rating >= 2.5) return { text: 'Fair Security', variant: 'outline' as const, color: 'text-yellow-600' };
    return { text: 'Poor Security', variant: 'destructive' as const, color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      {/* Overall Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Security & Trust Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating), 'lg')}
              </div>
              <p className="text-sm text-gray-600">Overall Rating</p>
              <p className="text-xs text-gray-500">{reviews.length} reviews</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {averageSecurityRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageSecurityRating), 'lg')}
              </div>
              <p className="text-sm text-gray-600">Security Rating</p>
              <Badge className={`mt-1 ${getSecurityBadge(averageSecurityRating).color}`}>
                {getSecurityBadge(averageSecurityRating).text}
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.round((reviews.filter(r => r.verified).length / reviews.length) * 100)}%
              </div>
              <div className="flex justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Verified Reviews</p>
              <p className="text-xs text-gray-500">Trusted feedback</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm font-medium w-8">{star}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Review */}
      {!showAddReview ? (
        <Card>
          <CardContent className="p-6">
            <Button 
              onClick={() => setShowAddReview(true)}
              className="w-full"
            >
              Write a Security Review
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Write Your Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="carTitle">Vehicle (Optional)</Label>
                <input
                  id="carTitle"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., BMW 3 Series"
                  value={newReview.carTitle}
                  onChange={(e) => setNewReview(prev => ({ ...prev, carTitle: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="bookingDate">Booking Date (Optional)</Label>
                <input
                  id="bookingDate"
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newReview.bookingDate}
                  onChange={(e) => setNewReview(prev => ({ ...prev, bookingDate: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label>Overall Rating</Label>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {newReview.rating} star{newReview.rating !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security Rating
              </Label>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReview(prev => ({ ...prev, securityRating: star }))}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= newReview.securityRating ? 'text-blue-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {newReview.securityRating} star{newReview.securityRating !== 1 ? 's' : ''} security
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor="title">Review Title</Label>
              <input
                id="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Summarize your experience"
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="comment">Detailed Review</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience with security, safety, and overall service..."
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowAddReview(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                className="flex-1"
                disabled={!newReview.title || !newReview.comment}
              >
                Submit Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => {
          const securityBadge = getSecurityBadge(review.securityRating);
          return (
            <Card key={review.id} className={review.reported ? 'opacity-50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.reviewerImage} />
                    <AvatarFallback>
                      {review.reviewerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{review.reviewerName}</span>
                      <Badge variant="outline" className="text-xs">
                        {review.reviewerType === 'owner' ? 'Owner' : 'Renter'}
                      </Badge>
                      {review.verified && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      <Badge variant={securityBadge.variant} className="text-xs">
                        {securityBadge.text}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating, 'sm')}
                        <span className="text-sm text-gray-600 ml-1">Overall</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-blue-600" />
                        {renderStars(review.securityRating, 'sm')}
                        <span className="text-sm text-gray-600 ml-1">Security</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {review.carTitle && (
                      <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                        <Car className="h-3 w-3" />
                        <span>{review.carTitle}</span>
                        {review.bookingDate && (
                          <>
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(review.bookingDate).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    )}
                    
                    <h3 className="font-medium mb-2">{review.title}</h3>
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onHelpfulReview(review.id)}
                        className="flex items-center gap-1"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        Helpful ({review.helpful})
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReportReview(review.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Flag className="h-3 w-3" />
                        Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {reviews.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600 mb-4">
              Be the first to share your security experience
            </p>
            <Button onClick={() => setShowAddReview(true)}>
              Write First Review
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
