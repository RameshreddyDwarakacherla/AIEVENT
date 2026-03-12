import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Paper,
  Avatar
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const ImageUpload = ({
  onUpload,
  currentImage,
  onDelete,
  maxSize = 5, // MB
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  variant = 'default', // 'default', 'avatar', 'banner'
  loading = false
}) => {
  const [preview, setPreview] = useState(currentImage);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      setError(`Please upload a valid image (${acceptedFormats.join(', ')})`);
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Call upload handler
    if (onUpload) {
      onUpload(file);
    }
  };

  const handleDelete = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onDelete) {
      onDelete();
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (variant === 'avatar') {
    return (
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <Avatar
          src={preview}
          sx={{
            width: 120,
            height: 120,
            cursor: 'pointer',
            border: '4px solid',
            borderColor: 'background.paper',
            boxShadow: 3
          }}
          onClick={handleClick}
        >
          <PhotoCameraIcon sx={{ fontSize: 40 }} />
        </Avatar>
        
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.5)',
              borderRadius: '50%'
            }}
          >
            <CircularProgress size={30} sx={{ color: 'white' }} />
          </Box>
        )}

        {preview && !loading && (
          <IconButton
            size="small"
            onClick={handleDelete}
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              bgcolor: 'error.main',
              color: 'white',
              '&:hover': { bgcolor: 'error.dark' }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {error && (
          <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
            {error}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '2px dashed',
        borderColor: error ? 'error.main' : 'divider',
        borderRadius: 2,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'action.hover'
        }
      }}
      onClick={handleClick}
    >
      {preview ? (
        <Box sx={{ position: 'relative' }}>
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: '100%',
              maxHeight: variant === 'banner' ? 200 : 300,
              borderRadius: 8
            }}
          />
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.5)',
                borderRadius: 2
              }}
            >
              <CircularProgress sx={{ color: 'white' }} />
            </Box>
          )}
          {!loading && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'error.main',
                color: 'white',
                '&:hover': { bgcolor: 'error.dark' }
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      ) : (
        <Box>
          <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Click to upload image
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or drag and drop
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Max size: {maxSize}MB
          </Typography>
        </Box>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 2, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
};

export default ImageUpload;
