import { MapPin } from 'lucide-react';

const DonationMap = ({ donations }) => {
  // Filter donations with valid coordinates
  const validDonations = donations.filter(
    (d) =>
      d.pickupLocation?.coordinates?.coordinates &&
      d.pickupLocation.coordinates.coordinates[0] !== 0 &&
      d.pickupLocation.coordinates.coordinates[1] !== 0
  );

  if (validDonations.length === 0) {
    return (
      <div className="card text-center py-12">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No donations with location data</p>
      </div>
    );
  }

  // Calculate center point
  const centerLat =
    validDonations.reduce(
      (sum, d) => sum + d.pickupLocation.coordinates.coordinates[1],
      0
    ) / validDonations.length;
  const centerLng =
    validDonations.reduce(
      (sum, d) => sum + d.pickupLocation.coordinates.coordinates[0],
      0
    ) / validDonations.length;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <MapPin className="h-5 w-5 mr-2" />
        Donation Locations
      </h3>

      {/* Static Map using Google Maps */}
      <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={`https://maps.google.com/maps?q=${centerLat},${centerLng}&output=embed&z=12`}
          style={{ border: 0 }}
        />
      </div>

      {/* Donation List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {validDonations.map((donation) => (
          <div
            key={donation._id}
            className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{donation.title}</p>
              <p className="text-sm text-gray-600">
                {donation.pickupLocation?.address?.city || 'Location'}
              </p>
            </div>
            <a
              href={`https://www.google.com/maps?q=${donation.pickupLocation.coordinates.coordinates[1]},${donation.pickupLocation.coordinates.coordinates[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationMap;
