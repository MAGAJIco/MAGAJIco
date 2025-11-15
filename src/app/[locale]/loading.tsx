
import SkeletonCard from "../components/SkeletonCard";

export default function Loading() {
  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '100px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ 
          height: '48px', 
          width: '300px', 
          background: 'rgba(255,255,255,0.3)', 
          borderRadius: '8px',
          margin: '0 auto 12px'
        }} />
        <div style={{ 
          height: '18px', 
          width: '200px', 
          background: 'rgba(255,255,255,0.2)', 
          borderRadius: '4px',
          margin: '0 auto'
        }} />
      </div>

      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>

      <section style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px'
      }}>
        <div style={{ 
          height: '32px', 
          width: '250px', 
          background: '#e5e7eb', 
          borderRadius: '8px',
          marginBottom: '16px'
        }} />
        <div style={{ 
          height: '18px', 
          width: '100%', 
          background: '#e5e7eb', 
          borderRadius: '4px',
          marginBottom: '8px'
        }} />
        <div style={{ 
          height: '18px', 
          width: '80%', 
          background: '#e5e7eb', 
          borderRadius: '4px'
        }} />
      </section>
    </div>
  );
}
