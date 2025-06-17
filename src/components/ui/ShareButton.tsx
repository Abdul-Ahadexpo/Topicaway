import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

interface ShareButtonProps {
  giveawayId: string;
  title: string;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ giveawayId, title, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareUrl = `${window.location.origin}?giveaway=${giveawayId}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Join ${title} - Topicaway`,
          text: `Check out this amazing giveaway: ${title}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      // Fallback to manual copy
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (clipboardError) {
        console.error('Failed to copy to clipboard:', clipboardError);
      }
    }
  };

  return (
    <motion.button
      onClick={handleShare}
      className={`flex items-center space-x-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title="Share this giveaway"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-600" />
          <span className="text-green-600">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </>
      )}
    </motion.button>
  );
};

export default ShareButton;