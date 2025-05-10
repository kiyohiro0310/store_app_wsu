export const StarRating = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
    return (
      <div className="flex items-center space-x-1">
        {Array(fullStars).fill(0).map((_, i) => (
          <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.3 3.993h4.2c.969 0 1.371 1.24.588 1.81l-3.4 2.487 1.3 3.993c.3.921-.755 1.688-1.538 1.118L10 13.348l-3.4 2.487c-.783.57-1.838-.197-1.538-1.118l1.3-3.993-3.4-2.487c-.783-.57-.38-1.81.588-1.81h4.2l1.3-3.993z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.3 3.993h4.2c.969 0 1.371 1.24.588 1.81l-3.4 2.487 1.3 3.993c.3.921-.755 1.688-1.538 1.118L10 13.348l-3.4 2.487c-.783.57-1.838-.197-1.538-1.118l1.3-3.993-3.4-2.487c-.783-.57-.38-1.81.588-1.81h4.2l1.3-3.993z"
              fill="url(#half)"
            />
          </svg>
        )}
        {Array(emptyStars).fill(0).map((_, i) => (
          <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.3 3.993h4.2c.969 0 1.371 1.24.588 1.81l-3.4 2.487 1.3 3.993c.3.921-.755 1.688-1.538 1.118L10 13.348l-3.4 2.487c-.783.57-1.838-.197-1.538-1.118l1.3-3.993-3.4-2.487c-.783-.57-.38-1.81.588-1.81h4.2l1.3-3.993z" />
          </svg>
        ))}
      </div>
    );
  };
  