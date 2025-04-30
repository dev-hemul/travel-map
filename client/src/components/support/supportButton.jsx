export default function SupportButton({ onClick }) {
    return (
      <button
        onClick={onClick}
        style={{
          position: 'absolute',
          bottom: 20,  
          left: 20,    
          zIndex: 1000,
          padding: '10px 15px',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer'
        }}
      >
        Підтримка
      </button>
    );
  }
  