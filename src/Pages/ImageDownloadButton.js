import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const ImageDownloadButton = ({ imageUrl }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      className="btn btn-primary"
      onClick={handleDownload}
    >
      <FontAwesomeIcon icon={faDownload} />
      Download
    </button>
  );
};

export default ImageDownloadButton;
