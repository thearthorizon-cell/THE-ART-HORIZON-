import React, { useState } from 'react';
import { X, Star, CheckCircle2, ExternalLink, Send, Heart } from 'lucide-react';
import { GoogleIcon } from './GoogleReviewsBadge';
import { GOOGLE_REVIEWS_SUMMARY } from '../../data/testimonialsData';
import { useStudio } from '../../context/StudioContext';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({ isOpen, onClose }) => {
  const { addEnquiry } = useStudio();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState('');
  const [courseOrRole, setCourseOrRole] = useState('Kids Art Classes (Parent)');
  const [reviewText, setReviewText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewText.trim()) return;

    addEnquiry({
      name: reviewerName.trim(),
      email: '',
      phone: `${rating} Star Google Review`,
      serviceCategory: 'general',
      serviceDetail: `Review: ${rating} Stars - ${courseOrRole}`,
      message: `Rating: ${rating}/5 Stars. Role: ${courseOrRole}. Review: ${reviewText.trim()}`,
    });

    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setReviewerName('');
    setReviewText('');
    setRating(5);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white border border-stone-200 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-[#1C1917] to-stone-900 text-white px-6 py-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-stone-900 shadow-xs">
              <GoogleIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                Review The Art Horizon on Google
              </h3>
              <p className="text-[11px] text-stone-300">
                4.9 ★ Rating • {GOOGLE_REVIEWS_SUMMARY.totalReviews}+ Verified Reviews
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-stone-400 hover:text-white p-1 rounded-xl hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-stone-900">Thank You for Your Review!</h4>
            <p className="text-stone-600 text-sm max-w-sm mx-auto">
              Your {rating}-star reflection has been received. Your support helps other students and parents discover authentic fine arts education with Vikas Gothi.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={GOOGLE_REVIEWS_SUMMARY.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4285F4] hover:bg-[#3367D6] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs"
              >
                <GoogleIcon className="w-3.5 h-3.5" />
                <span>Post directly on Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={handleClose}
                className="w-full sm:w-auto text-stone-600 hover:text-stone-900 text-xs font-semibold py-2"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
            {/* Direct Google Maps Callout */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <GoogleIcon className="w-3.5 h-3.5" />
                  <span>Have a Google Account?</span>
                </div>
                <div className="text-[11px] text-stone-600">
                  You can also post your rating directly to our live Google Maps listing.
                </div>
              </div>
              <a
                href={GOOGLE_REVIEWS_SUMMARY.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 px-3.5 py-1.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </a>
            </div>

            {/* Interactive Star Rating */}
            <div className="text-center space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Select Your Rating
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isFilled = (hoverRating || rating) >= starVal;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(starVal)}
                      className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="text-xs font-semibold text-amber-700">
                {rating === 5 && '★★★★★ Excellent (5.0 / 5.0)'}
                {rating === 4 && '★★★★☆ Very Good (4.0 / 5.0)'}
                {rating === 3 && '★★★☆☆ Good (3.0 / 5.0)'}
                {rating === 2 && '★★☆☆☆ Fair (2.0 / 5.0)'}
                {rating === 1 && '★☆☆☆☆ Needs Improvement'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Association / Course
                </label>
                <select
                  value={courseOrRole}
                  onChange={(e) => setCourseOrRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828]"
                >
                  <option value="Kids Art Classes (Parent)">Kids Art Classes (Parent)</option>
                  <option value="International Online Zoom Batch">International Online Zoom Batch</option>
                  <option value="Teen Art Program">Teen Art Program</option>
                  <option value="Adult Drawing & Painting">Adult Drawing & Painting</option>
                  <option value="Custom Portrait Commission">Custom Portrait Commission</option>
                  <option value="Commercial Mural / Rangoli Project">Commercial Mural / Rangoli Project</option>
                  <option value="Art Workshop Attendee">Art Workshop Attendee</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Review & Experience <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience about Vikas sir's teaching, small batch focus, portrait quality, or your child's progress..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-[#D82828] to-amber-600 hover:opacity-95 text-white px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <span>Submit Review</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
