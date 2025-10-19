import { Leaf, Droplet, Wind, Flame, Recycle } from 'lucide-react';

const EnvironmentalImpact = ({ totalServings }) => {
  // Environmental impact calculations (approximate)
  const calculations = {
    // Average: 1 serving = 0.4 kg food
    foodSaved: (totalServings * 0.4).toFixed(1), // kg
    // Average: 1 kg food = 2.5 kg CO2
    co2Saved: (totalServings * 0.4 * 2.5).toFixed(1), // kg
    // Average: 1 kg food = 250 liters water
    waterSaved: Math.round(totalServings * 0.4 * 250), // liters
    // Energy equivalent to 1 serving = 0.5 kWh
    energySaved: (totalServings * 0.5).toFixed(1), // kWh
    // Waste diverted from landfills
    wasteDiverted: (totalServings * 0.35).toFixed(1) // kg
  };

  const impactItems = [
    {
      icon: Recycle,
      label: 'Food Saved',
      value: calculations.foodSaved,
      unit: 'kg',
      color: 'from-green-500 to-green-700',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      icon: Wind,
      label: 'CO₂ Reduced',
      value: calculations.co2Saved,
      unit: 'kg',
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      icon: Droplet,
      label: 'Water Saved',
      value: calculations.waterSaved.toLocaleString(),
      unit: 'L',
      color: 'from-cyan-500 to-cyan-700',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700'
    },
    {
      icon: Flame,
      label: 'Energy Saved',
      value: calculations.energySaved,
      unit: 'kWh',
      color: 'from-orange-500 to-orange-700',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      icon: Leaf,
      label: 'Waste Diverted',
      value: calculations.wasteDiverted,
      unit: 'kg',
      color: 'from-emerald-500 to-emerald-700',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 mb-12 border-2 border-green-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🌍 Environmental Impact
        </h2>
        <p className="text-gray-600">
          By reducing food waste, we're helping our planet
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {impactItems.map((item, index) => (
          <div
            key={index}
            className={`${item.bgColor} rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${item.color} text-white mb-3 shadow-md`}>
              <item.icon className="h-6 w-6" />
            </div>
            <div className={`text-2xl font-bold ${item.textColor} mb-1`}>
              {item.value}
              <span className="text-sm ml-1">{item.unit}</span>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          💡 <strong>Did you know?</strong> Every serving saved is equivalent to preventing{' '}
          <span className="text-green-600 font-semibold">{(calculations.co2Saved / totalServings).toFixed(2)} kg</span> of CO₂ emissions!
        </p>
      </div>
    </div>
  );
};

export default EnvironmentalImpact;
