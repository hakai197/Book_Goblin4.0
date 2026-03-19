export default function PageTransition({ active }) {
  return (
    <div className={`page-transition${active ? ' active' : ''}`}>
      <img src="/Img/page_turning.gif" alt="Loading" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  )
}
