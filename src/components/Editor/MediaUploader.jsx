import { useState, useRef, useEffect } from 'react';
import { Image, Music, Link, Upload, X, Mic, Square } from 'lucide-react';

export default function MediaUploader({ media, onUpdate, label = "Add Media" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputType, setInputType] = useState('url'); // 'url', 'file', or 'record'
    const [urlInput, setUrlInput] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    // Recording state
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (mediaRecorderRef.current && isRecording) {
                mediaRecorderRef.current.stop();
            }
        };
    }, [isRecording]);

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

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new window.Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG with 0.7 quality
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(dataUrl);
                };
            };
        });
    };

    const processFile = async (file) => {
        if (!file) return;

        // 1MB limit check (1024 * 1024 bytes)
        if (file.size > 1024 * 1024) {
            alert('File is too large! Please use a file smaller than 1MB.');
            return;
        }

        if (file.type.startsWith('image')) {
            try {
                const compressedDataUrl = await compressImage(file);
                onUpdate({
                    type: 'image',
                    url: compressedDataUrl
                });
                setIsOpen(false);
            } catch (error) {
                console.error("Compression failed", error);
                alert("Failed to process image.");
            }
        } else if (file.type.startsWith('audio')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdate({
                    type: 'audio',
                    url: reader.result
                });
                setIsOpen(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileUpload = (e) => {
        processFile(e.target.files[0]);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.onloadend = () => {
                    onUpdate({
                        type: 'audio',
                        url: reader.result
                    });
                    setIsOpen(false);
                    setIsRecording(false);
                    setRecordingTime(0);
                };
                reader.readAsDataURL(blob);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => {
                    if (prev >= 10) { // 10 seconds limit
                        stopRecording();
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please ensure you have granted permission.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
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
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
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
                            style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}
                            onClick={() => setInputType('url')}
                            title="URL"
                        >
                            <Link size={14} />
                        </button>
                        <button
                            className={`btn ${inputType === 'file' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}
                            onClick={() => setInputType('file')}
                            title="Upload"
                        >
                            <Upload size={14} />
                        </button>
                        <button
                            className={`btn ${inputType === 'record' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}
                            onClick={() => setInputType('record')}
                            title="Record Audio"
                        >
                            <Mic size={14} />
                        </button>
                    </div>

                    {inputType === 'url' && (
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
                    )}

                    {inputType === 'file' && (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            style={{
                                border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`,
                                borderRadius: 'var(--radius-md)',
                                padding: '1.5rem',
                                textAlign: 'center',
                                background: isDragging ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                transition: 'all 0.2s'
                            }}
                        >
                            <input
                                type="file"
                                accept="image/*,audio/*"
                                onChange={handleFileUpload}
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                                <Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                                    Click to upload or drag & drop
                                </p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    Max size: 1MB (Images will be compressed)
                                </p>
                            </label>
                        </div>
                    )}

                    {inputType === 'record' && (
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            {!isRecording ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={startRecording}
                                    style={{ borderRadius: '50%', width: '60px', height: '60px', padding: 0 }}
                                >
                                    <Mic size={24} />
                                </button>
                            ) : (
                                <div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--error)' }}>
                                        00:{recordingTime.toString().padStart(2, '0')} / 00:10
                                    </div>
                                    <button
                                        className="btn"
                                        onClick={stopRecording}
                                        style={{
                                            borderRadius: '50%',
                                            width: '60px',
                                            height: '60px',
                                            padding: 0,
                                            background: 'var(--error)',
                                            color: 'white',
                                            border: 'none'
                                        }}
                                    >
                                        <Square size={24} fill="currentColor" />
                                    </button>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                        Recording... (Max 10s)
                                    </p>
                                </div>
                            )}
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
