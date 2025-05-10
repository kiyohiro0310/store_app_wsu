export function Newsletter() {
  return (
    <section className="bg-yellow-50 py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h3 className="text-2xl font-semibold mb-2">Stay Updated</h3>
        <p className="mb-4 text-gray-600">
          Subscribe to get updates on new arrivals, discounts, and more.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 border rounded w-full sm:w-auto"
          />
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}
