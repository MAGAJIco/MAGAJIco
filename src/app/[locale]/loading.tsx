// Loading.jsx
import SkeletonCard from "../components/SkeletonCard";

export default function Loading() {
  const headerStyles = "bg-gray-300 rounded-md mx-auto mb-3";
  const subHeaderStyles = "bg-gray-200 rounded-sm mx-auto";

  return (
    <div className="container px-4 py-10">
      {/* Header Skeleton */}
      <div className="text-center mb-10">
        <div className={`${headerStyles} h-12 w-72`} />
        <div className={`${subHeaderStyles} h-4 w-48`} />
      </div>

      {/* Horizontal Card Skeletons */}
      <section className="mb-10 overflow-x-auto">
        <div className="flex gap-5 pb-2">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>

      {/* Paragraph Skeleton */}
      <section className="bg-white/95 rounded-2xl p-8 mb-8">
        <div className="bg-gray-300 h-8 w-64 rounded-md mb-4" />
        <div className="bg-gray-200 h-4 w-full rounded-sm mb-2" />
        <div className="bg-gray-200 h-4 w-4/5 rounded-sm" />
      </section>
    </div>
  );
}