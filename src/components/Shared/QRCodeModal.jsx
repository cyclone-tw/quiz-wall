import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { X, Save, Link } from 'lucide-react';

export default function QRCodeModal({ isOpen, onClose }) {
    const [url, setUrl] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const savedUrl = localStorage.getItem('quizwall-app-url');
        if (savedUrl) {
            setUrl(savedUrl);
        } else {
            // Default to current location if nothing saved
            setUrl(window.location.href);
        }
    }, [isOpen]);

    const handleSave = () => {
        localStorage.setItem('quizwall-app-url', url);
        setIsEditing(false);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{ width: '90%', maxWidth: '400px', position: 'relative', background: 'white' }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <X size={24} />
                </button>

                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Scan to Play</h2>

                <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <QRCode value={url} size={200} />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        App URL
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            className="input"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={!isEditing}
                            style={{ fontSize: '0.9rem' }}
                        />
                        {isEditing ? (
                            <button className="btn btn-primary" onClick={handleSave}>
                                <Save size={16} />
                            </button>
                        ) : (
                            <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                                <Link size={16} />
                            </button>
                        )}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        {isEditing ? 'Enter the URL where your app is hosted.' : 'This URL is saved in your browser.'}
                    </p>
                </div>
            </div>
        </div>
    );
}
