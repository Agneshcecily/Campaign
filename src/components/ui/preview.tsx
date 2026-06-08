import React from 'react';

type TemplatePreviewModalProps = {
  htmlContent: string;
  onClose: () => void;
};

const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({ htmlContent, onClose }) => {
  if (!htmlContent) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        position: 'relative',
        backgroundColor: '#fff',
        width: '90%',
        maxWidth: '800px',
        height: '90%',
        borderRadius: '10px',
        overflow: 'auto',
        padding: '20px',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '24px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          &times;
        </button>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </div>
  );
};

export default TemplatePreviewModal;
