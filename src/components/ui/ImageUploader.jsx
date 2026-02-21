import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, ImagePlus, Loader2, Trash2, AlertCircle } from 'lucide-react';
import { uploadAPI } from '../../services/api';

export default function ImageUploader({ images = [], onChange, maxImages = 5 }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');
  const [deletingIndex, setDeletingIndex] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = useCallback(async (files) => {
    const validFiles = Array.from(files).filter(f =>
      ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(f.type)
    );

    if (validFiles.length === 0) {
      setError('Please select a valid image file (JPG, PNG, or WebP)');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      setError(`Maximum ${maxImages} images allowed`);
      setTimeout(() => setError(''), 3000);
      return;
    }

    const filesToUpload = validFiles.slice(0, remaining);
    setUploading(true);
    setError('');

    try {
      const uploaded = [];
      for (let i = 0; i < filesToUpload.length; i++) {
        setUploadProgress(`Uploading ${i + 1} of ${filesToUpload.length}...`);
        const result = await uploadAPI.uploadImage(filesToUpload[i]);
        uploaded.push(result.url);
      }
      onChange([...images, ...uploaded]);
      setUploadProgress('');
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  }, [images, maxImages, onChange]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileSelect = (e) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  const removeImage = async (index) => {
    const url = images[index];
    setDeletingIndex(index);
    setError('');
    try {
      // Only call Cloudinary delete for Cloudinary URLs
      if (url.includes('res.cloudinary.com')) {
        await uploadAPI.deleteImage(url);
      }
      const updated = images.filter((_, i) => i !== index);
      onChange(updated);
    } catch (err) {
      setError(err.message || 'Failed to delete image');
      setTimeout(() => setError(''), 4000);
    } finally {
      setDeletingIndex(null);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-slate-400 mb-1.5">
        Event Images ({images.length}/{maxImages})
      </label>

      {/* Uploaded Images Preview */}
      <AnimatePresence mode="popLayout">
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {images.map((url, index) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
                className="relative group aspect-video rounded-xl overflow-hidden border border-white/10 bg-white/5"
              >
                <img
                  src={url}
                  alt={`Event image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                  {deletingIndex === index ? (
                    <div className="flex flex-col items-center gap-1">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                      <span className="text-[10px] text-white/80">Deleting…</span>
                    </div>
                  ) : (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, scale: 0 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => removeImage(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-red-500/90 text-white shadow-lg backdrop-blur-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
                {/* Badge */}
                {index === 0 && (
                  <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-ice-500/90 text-white backdrop-blur-sm">
                    Cover
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop Zone */}
      {images.length < maxImages && (
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          whileHover={!uploading ? { scale: 1.005 } : {}}
          whileTap={!uploading ? { scale: 0.995 } : {}}
          className={`
            relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300
            ${isDragging
              ? 'border-ice-400 bg-ice-500/10 shadow-[0_0_30px_rgba(56,189,248,0.1)]'
              : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
            }
            ${uploading ? 'pointer-events-none' : ''}
          `}
        >
          <div className="flex flex-col items-center justify-center py-8 px-4">
            {uploading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="relative">
                  <Loader2 className="w-10 h-10 text-ice-400 animate-spin" />
                  <div className="absolute inset-0 w-10 h-10 rounded-full bg-ice-400/20 animate-ping" />
                </div>
                <p className="text-sm text-ice-300 font-medium">{uploadProgress}</p>
              </motion.div>
            ) : (
              <>
                <motion.div
                  animate={isDragging ? { y: -4, scale: 1.05 } : { y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center mb-3
                    ${isDragging
                      ? 'bg-ice-500/20 text-ice-400'
                      : 'bg-white/5 text-slate-400'
                    }
                  `}
                >
                  {isDragging ? (
                    <Upload className="w-6 h-6" />
                  ) : (
                    <ImagePlus className="w-6 h-6" />
                  )}
                </motion.div>
                <p className="text-sm text-slate-300 font-medium mb-1">
                  {isDragging ? 'Drop your images here' : 'Click to upload or drag & drop'}
                </p>
                <p className="text-xs text-slate-500">
                  JPG, PNG or WebP • Max 10MB • Up to {maxImages - images.length} more
                </p>
              </>
            )}
          </div>

          {/* Animated border glow on drag */}
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(56,189,248,0.05) 0%, rgba(56,189,248,0) 50%, rgba(56,189,248,0.05) 100%)',
              }}
            />
          )}
        </motion.div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={maxImages - images.length > 1}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
