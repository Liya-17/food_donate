import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';
import { Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const SocialShare = ({ donation, url }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;
  const title = `Check out this food donation: ${donation.title}`;
  const description = `${donation.servings} servings of ${donation.foodType} food available for pickup. Help reduce food waste!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Share This Donation</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Help spread the word about this donation to reduce food waste!
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <FacebookShareButton url={shareUrl} quote={title}>
          <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 cursor-pointer">
            <FacebookIcon size={24} round />
            <span className="text-sm font-medium text-blue-900">Facebook</span>
          </div>
        </FacebookShareButton>

        <TwitterShareButton url={shareUrl} title={title}>
          <div className="flex items-center gap-2 px-4 py-3 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors border border-sky-200 cursor-pointer">
            <TwitterIcon size={24} round />
            <span className="text-sm font-medium text-sky-900">Twitter</span>
          </div>
        </TwitterShareButton>

        <WhatsappShareButton url={shareUrl} title={title} separator=" - ">
          <div className="flex items-center gap-2 px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200 cursor-pointer">
            <WhatsappIcon size={24} round />
            <span className="text-sm font-medium text-green-900">WhatsApp</span>
          </div>
        </WhatsappShareButton>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
        >
          {copied ? (
            <Check className="h-5 w-5 text-green-600" />
          ) : (
            <Copy className="h-5 w-5 text-gray-600" />
          )}
          <span className="text-sm font-medium text-gray-900">
            {copied ? 'Copied!' : 'Copy Link'}
          </span>
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

export default SocialShare;
