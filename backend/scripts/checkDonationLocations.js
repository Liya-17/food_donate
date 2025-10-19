const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const Donation = require('../models/Donation');
const User = require('../models/User');

async function checkDonationLocations() {
  try {
    const donations = await Donation.find({})
      .select('title pickupLocation status')
      .populate('donor', 'name');

    console.log('\n📍 DONATION LOCATIONS CHECK\n');
    console.log(`Total donations: ${donations.length}\n`);

    let validLocations = 0;
    let invalidLocations = 0;
    let missingCoordinates = 0;

    donations.forEach((donation, index) => {
      const coords = donation.pickupLocation?.coordinates?.coordinates;
      const address = donation.pickupLocation?.address;

      console.log(`${index + 1}. ${donation.title} (${donation.status})`);
      console.log(`   Donor: ${donation.donor?.name || 'Unknown'}`);

      if (!coords || coords.length !== 2) {
        console.log(`   ❌ Missing coordinates`);
        missingCoordinates++;
      } else if (coords[0] === 0 && coords[1] === 0) {
        console.log(`   ⚠️  Invalid coordinates: [0, 0]`);
        console.log(`   Address: ${address?.city || 'N/A'}, ${address?.state || 'N/A'}`);
        invalidLocations++;
      } else {
        console.log(`   ✓ Valid coordinates: [${coords[0]}, ${coords[1]}]`);
        console.log(`   Address: ${address?.city || 'N/A'}, ${address?.state || 'N/A'}`);
        validLocations++;
      }
      console.log('');
    });

    console.log('\n📊 SUMMARY:');
    console.log(`   ✓ Valid locations: ${validLocations}`);
    console.log(`   ⚠️  Invalid (0,0) coordinates: ${invalidLocations}`);
    console.log(`   ❌ Missing coordinates: ${missingCoordinates}`);

    if (invalidLocations > 0 || missingCoordinates > 0) {
      console.log('\n⚠️  WARNING: Some donations have invalid or missing coordinates!');
      console.log('   These donations will NOT appear in "Find Nearby Donations" searches.');
      console.log('   Consider running a fix script to geocode their addresses.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkDonationLocations();
