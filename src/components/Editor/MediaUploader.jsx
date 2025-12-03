import { useState, useRef } from 'react';
import { Image, Music, Link, Upload, X } from 'lucide-react';

export default function MediaUploader({ media, onUpdate, label = "Add Media" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputType, setInputType] = useState('url'); // 'url' or 'file'
    const [urlInput, setUrlInput] = useState('');
    const fileInputRef = useRef(null);

    const handleUrlSubmit = () => {
        if (!urlInput.trim()) return;

        // Simple detection based on extension, default to image if unknown
        const isAudio = /\.(mp3|wav|ogg)$/i.test(urlInput);
        onUpdate({
            type: isAudio ? 'audio' : 'image',
            url: urlInput
        });
        setIsOpen(false);
        setUrlInput('');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 500 * 1024) { // 500KB limit
            alert('File is too large! Please use a URL or a file smaller than 500KB.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            onUpdate({
                type: file.type.startsWith('audio') ? 'audio' : 'image',
                url: reader.result
            });
            setIsOpen(false);
        };
        reader.readAsDataURL(file);
    };

    const removeMedia = () => {
        onUpdate(null);
    };

    if (media) {
        return (
            <div style={{ marginTop: '0.5rem', position: 'relative', display: 'inline-block' }}>
                {media.type === 'image' ? (
                    <img
                        src={media.url}
                        alt="Question media"
                        style={{ maxHeight: '150px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                    />
                ) : (
                    <audio controls src={media.url} style={{ marginTop: '0.5rem' }} />
                )}
                <button
                    onClick={removeMedia}
                    style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: 'var(--error)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    <X size={14} />
                </button>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            {!isOpen ? (
                <button
                    className="btn btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                    onClick={() => setIsOpen(true)}
                >
                    <Image size={14} /> / <Music size={14} /> {label}
                </button>
            ) : (
                <div className="card" style={{
                    position: 'absolute',
                    zIndex: 10,
                    padding: '1rem',
                    width: '300px',
                    top: '100%',
                    left: 0,
                    marginTop: '0.5rem'
                }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <button
                            className={`btn ${inputType === 'url' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1, fontSize: '0.8rem' }}
                            onClick={() => setInputType('url')}
                        >
                            <Link size={14} /> URL
                        </button>
                        <button
                            className={`btn ${inputType === 'file' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1, fontSize: '0.8rem' }}
                            onClick={() => setInputType('file')}
                        >
                            <Upload size={14} /> Upload
                        </button>
                    </div>

                    {inputType === 'url' ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                className="input"
                                placeholder="https://example.com/image.jpg"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                style={{ fontSize: '0.9rem' }}
                            />
                            <button className="btn btn-primary" onClick={handleUrlSubmit}>Add</button>
                        </div>
                    ) : (
                        <div>
                            <input
                                type="file"
                                accept="image/*,audio/*"
                                onChange={handleFileUpload}
                                ref={fileInputRef}
                                style={{ width: '100%' }}
                            />
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                Max size: 500KB. For larger files, please use URL.
                            </p>
                        </div>
                    )}

                    <button
                        style={{
                            marginTop: '1rem',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            fontSize: '0.8rem',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            width: '100%'
                        }}
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}
