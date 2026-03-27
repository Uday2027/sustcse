import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';

const SignatureUploader: React.FC = () => {
  const [sigMode, setSigMode] = useState<'draw' | 'upload'>('draw');
  const [uploading, setUploading] = useState(false);
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [sealUrl, setSealUrl] = useState<string | null>(null);

  const clearCanvas = () => sigCanvasRef.current?.clear();

  const handleSaveSignature = async () => {
    try {
      setUploading(true);
      let blob: Blob;

      if (sigMode === 'draw') {
        if (sigCanvasRef.current?.isEmpty()) {
          toast.error('Please draw a signature first');
          return;
        }
        const dataUrl = sigCanvasRef.current!.getTrimmedCanvas().toDataURL('image/png');
        blob = await (await fetch(dataUrl)).blob();
      } else {
        // Handle file upload
        toast.error('File upload not implemented in draw mode');
        return;
      }

      const formData = new FormData();
      formData.append('signature', blob, 'signature.png');

      const response = await api.post('/users/me/signature', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSignatureUrl(response.data.data.signature_url);
      toast.success('Signature saved successfully');
    } catch (error) {
      toast.error('Failed to save signature');
    } finally {
      setUploading(false);
    }
  };

  const handleSealUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('seal', file);

      const response = await api.post('/users/me/seal', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSealUrl(response.data.data.seal_url);
      toast.success('Seal uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload seal');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="skeu-card" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Digital Signature</h3>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button 
            onClick={() => setSigMode('draw')}
            className={`skeu-btn ${sigMode === 'draw' ? 'skeu-btn--primary' : ''}`}
          >
            Draw
          </button>
          <button 
            onClick={() => setSigMode('upload')}
            className={`skeu-btn ${sigMode === 'upload' ? 'skeu-btn--primary' : ''}`}
          >
            Upload Image
          </button>
        </div>

        {sigMode === 'draw' ? (
          <div style={{ border: '2px dashed var(--color-border)', borderRadius: '12px', padding: '0.5rem', background: 'var(--color-surface-alt, #f8f9fa)' }}>
            <SignatureCanvas 
              ref={sigCanvasRef}
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: 'signature-canvas', style: { width: '100%', background: 'white', borderRadius: '8px' } }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button onClick={clearCanvas} className="skeu-btn" style={{ padding: '0.5rem 1rem', color: 'var(--color-error)' }}>Clear</button>
            </div>
          </div>
        ) : (
          <input 
            type="file" 
            accept="image/*"
            style={{ width: '100%', padding: '1rem', border: '2px dashed var(--color-border)', borderRadius: '12px' }}
          />
        )}

        <button 
          onClick={handleSaveSignature}
          disabled={uploading}
          className="skeu-btn skeu-btn--primary"
          style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}
        >
          {uploading ? 'Saving...' : 'Save Signature'}
        </button>
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem', marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Official Seal / Stamp (Optional)</h3>
        <input 
          type="file" 
          accept="image/*"
          onChange={handleSealUpload}
          style={{ width: '100%', padding: '1rem', border: '2px dashed var(--color-border)', borderRadius: '12px' }}
        />
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Upload a transparent PNG of your official seal.</p>
      </div>
    </div>
  );
};

export default SignatureUploader;
