import React from 'react';
import { StarRating } from '../fragments/ui/StarRating';
import { Product } from '@/types';
import Loading from '../fragments/ui/Loading';


const Products = ({items}: {items: Product[]}) => {
  
  if (!items || items.length === 0) {
    return (
      <Loading />
    );
  }
  return (
    <div className="bg-gray-50 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-2xl overflow-hidden transition-transform transform hover:scale-105"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
              <p className="text-sm text-gray-500 mb-1">{product.category}</p>
              <p className="text-sm text-gray-700 mb-3 h-16">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">
                  {product.currency} {product.price.toFixed(2)}
                </span>
                {product.rating && (
                  <StarRating rating={product.rating} />
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
