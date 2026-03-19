export default function StarRating({ rating }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <span className="text-warning">
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <i key={i} className="bi bi-star-fill"></i>
        if (i === full && half) return <i key={i} className="bi bi-star-half"></i>
        return <i key={i} className="bi bi-star"></i>
      })}
    </span>
  )
}
