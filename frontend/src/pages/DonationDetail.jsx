import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { donationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  User,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageCircle
} from 'lucide-react';
import {
  formatDateTime,
  formatPickupTime,
  getStatusColor,
  getFoodTypeIcon,
  getCategoryLabel,
  timeAgo
} from '../utils/helpers';
import toast from 'react-hot-toast';
import PhotoGallery from '../components/PhotoGallery';
import CountdownTimer from '../components/CountdownTimer';
import QRCodeGenerator from '../components/QRCodeGenerator';
import SocialShare from '../components/SocialShare';
import ChatBox from '../components/ChatBox';

const DonationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    loadDonation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadDonation = async () => {
    try {
      const response = await donationAPI.getDonation(id);
      setDonation(response.data.data);
    } catch (error) {
      toast.error('Failed to load donation');
      navigate('/donations');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to claim donations');
      navigate('/login');
      return;
    }

    setClaiming(true);
    try {
      await donationAPI.claimDonation(id);
      toast.success('Donation claimed successfully!');
      loadDonation(); // Reload to show updated status
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to claim donation');
    } finally {
      setClaiming(false);
    }
  };

  const handleComplete = async () => {
    setClaiming(true);
    try {
      await donationAPI.completeDonation(id);
      toast.success('Donation marked as completed!');
      loadDonation();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete donation');
    } finally {
      setClaiming(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this donation?')) {
      return;
    }

    setClaiming(true);
    try {
      await donationAPI.cancelDonation(id);
      toast.success('Donation cancelled');
      navigate('/my-donations');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel donation');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Donation not found</h2>
          <button onClick={() => navigate('/donations')} className="btn-primary">
            Back to Donations
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && donation.donor?._id === user._id;
  const isClaimed = donation.status === 'claimed';
  const isCompleted = donation.status === 'completed';
  const isAvailable = donation.status === 'available';
  // const isClaimer = user && donation.claimedBy?._id === user._id;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-gray-600 hover:text-gray-900 flex items-center"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            <div className="card">
              <PhotoGallery images={donation.images} />
            </div>

            {/* Title and Status */}
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {donation.title}
                  </h1>
                  <span className={`badge ${getStatusColor(donation.status)}`}>
                    {donation.status}
                  </span>
                  {donation.isUrgent && (
                    <span className="badge badge-danger ml-2">Urgent</span>
                  )}
                  <div className="mt-3">
                    <CountdownTimer expiryTime={donation.expiryTime} />
                  </div>
                </div>
                <div className="text-4xl">{getFoodTypeIcon(donation.foodType)}</div>
              </div>

              <p className="text-gray-700 text-lg">{donation.description}</p>
            </div>

            {/* Details */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Food Type</p>
                  <p className="font-medium capitalize">{donation.foodType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium">{getCategoryLabel(donation.category)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="font-medium">{donation.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Servings</p>
                  <p className="font-medium">{donation.servings} people</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Pickup Time</p>
                  <p className="font-medium flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    {formatPickupTime(donation.availableTo)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Food Expires At</p>
                  <p className="font-medium text-sm">
                    {formatPickupTime(donation.expiryTime)}
                  </p>
                </div>
              </div>

              {donation.specialInstructions && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-900 mb-1">
                    Special Instructions
                  </p>
                  <p className="text-yellow-800">{donation.specialInstructions}</p>
                </div>
              )}
            </div>

            {/* Pickup Location */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Pickup Location
              </h2>
              {donation.pickupLocation?.address && (
                <div className="space-y-3">
                  {donation.pickupLocation.address.street && (
                    <p className="text-gray-700">{donation.pickupLocation.address.street}</p>
                  )}
                  <p className="text-gray-700">
                    {[
                      donation.pickupLocation.address.city,
                      donation.pickupLocation.address.state,
                      donation.pickupLocation.address.zipCode,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>

                  {/* Map Links */}
                  {donation.pickupLocation.coordinates?.coordinates &&
                    donation.pickupLocation.coordinates.coordinates[0] !== 0 && (
                      <div className="pt-3 border-t space-y-2">
                        <a
                          href={`https://www.google.com/maps?q=${donation.pickupLocation.coordinates.coordinates[1]},${donation.pickupLocation.coordinates.coordinates[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          Open in Google Maps
                        </a>

                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${donation.pickupLocation.coordinates.coordinates[1]},${donation.pickupLocation.coordinates.coordinates[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Get Directions
                        </a>

                        {/* Embedded Mini Map */}
                        <div className="mt-3 w-full h-48 rounded-lg overflow-hidden">
                          <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight="0"
                            marginWidth="0"
                            src={`https://maps.google.com/maps?q=${
                              donation.pickupLocation.coordinates.coordinates[1]
                            },${
                              donation.pickupLocation.coordinates.coordinates[0]
                            }&output=embed`}
                          />
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donor Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Donor Information</h3>
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{donation.donor?.name}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {donation.donor?.organizationType}
                  </p>
                  {donation.donor?.rating > 0 && (
                    <p className="text-sm text-gray-600">
                      ⭐ {donation.donor.rating.toFixed(1)} rating
                    </p>
                  )}
                </div>
              </div>

              {donation.contactInfo?.phone && isAuthenticated && (
                <div className="flex items-center space-x-2 text-gray-700">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${donation.contactInfo.phone}`} className="hover:underline">
                    {donation.contactInfo.phone}
                  </a>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="card space-y-3">
              {/* Only receivers and admins can claim donations */}
              {isAvailable && !isOwner && (user?.role === 'receiver' || user?.role === 'admin') && (
                <button
                  onClick={handleClaim}
                  disabled={claiming || !isAuthenticated}
                  className="w-full btn-primary py-3 flex items-center justify-center"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {claiming ? 'Claiming...' : 'Claim Donation'}
                </button>
              )}

              {/* Show message for donors trying to claim */}
              {isAvailable && !isOwner && user?.role === 'donor' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-900">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    Only receivers can claim donations. Switch to a receiver account to claim.
                  </p>
                </div>
              )}

              {isClaimed && isOwner && (
                <button
                  onClick={handleComplete}
                  disabled={claiming}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {claiming ? 'Processing...' : 'Mark as Complete'}
                </button>
              )}

              {isOwner && !isCompleted && (
                <button
                  onClick={handleCancel}
                  disabled={claiming}
                  className="w-full btn-secondary py-3 flex items-center justify-center"
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  {claiming ? 'Processing...' : 'Cancel Donation'}
                </button>
              )}

              {!isAuthenticated && isAvailable && (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full btn-primary py-3"
                >
                  Login to Claim
                </button>
              )}

              {isClaimed && donation.claimedBy && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900 mb-1">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    Claimed by {donation.claimedBy.name}
                  </p>
                  <p className="text-xs text-blue-700">
                    {timeAgo(donation.claimedAt)}
                  </p>
                </div>
              )}

              {isCompleted && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-900">
                    <CheckCircle className="h-4 w-4 inline mr-1" />
                    Donation completed
                  </p>
                </div>
              )}
            </div>

            {/* QR Code for Owners */}
            {isOwner && (isClaimed || isCompleted) && (
              <QRCodeGenerator donationId={donation._id} title={donation.title} />
            )}

            {/* Social Share */}
            <SocialShare donation={donation} />

            {/* Chat Button */}
            {isAuthenticated && donation.status === 'claimed' && (
              <button
                onClick={() => setShowChat(true)}
                className="card hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="h-5 w-5 text-primary-600" />
                <span className="font-medium text-gray-900">Chat</span>
              </button>
            )}

            {/* Stats */}
            <div className="card">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">{donation.views}</p>
                <p className="text-sm text-gray-600">Views</p>
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">Posted {timeAgo(donation.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Box */}
        {showChat && donation.donor && (
          <ChatBox
            donationId={donation._id}
            recipientId={donation.donor._id}
            recipientName={donation.donor.name}
            onClose={() => setShowChat(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DonationDetail;
