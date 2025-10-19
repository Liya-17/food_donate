import { Leaf, Users, TrendingDown, Award, Calculator } from 'lucide-react';

const ImpactCalculator = ({ donations = [] }) => {
  // Calculate impact metrics
  const calculateImpact = () => {
    const totalServings = donations.reduce((sum, d) => sum + (d.servings || 0), 0);
    const totalDonations = donations.length;

    // Average food waste per serving: ~0.5 kg
    const foodWasteSaved = (totalServings * 0.5).toFixed(1);

    // CO2 emissions saved: ~2.5 kg CO2 per kg of food waste
    const co2Saved = (foodWasteSaved * 2.5).toFixed(1);

    // Water saved: ~1000 liters per kg of food
    const waterSaved = (foodWasteSaved * 1000).toFixed(0);

    // People helped (assuming 1 serving = 1 meal for 1 person)
    const peopleHelped = totalServings;

    return {
      foodWasteSaved,
      co2Saved,
      waterSaved,
      peopleHelped,
      totalDonations,
      avgServingsPerDonation: totalDonations > 0 ? (totalServings / totalDonations).toFixed(1) : 0,
    };
  };

  const impact = calculateImpact();

  const metrics = [
    {
      icon: <Leaf className="h-8 w-8" />,
      value: impact.foodWasteSaved,
      unit: 'kg',
      label: 'Food Waste Saved',
      color: 'from-green-500 to-green-700',
      bgColor: 'from-green-50 to-green-100',
      textColor: 'text-green-600',
    },
    {
      icon: <TrendingDown className="h-8 w-8" />,
      value: impact.co2Saved,
      unit: 'kg',
      label: 'CO₂ Emissions Reduced',
      color: 'from-blue-500 to-blue-700',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-600',
    },
    {
      icon: <Users className="h-8 w-8" />,
      value: impact.peopleHelped,
      unit: 'people',
      label: 'People Fed',
      color: 'from-purple-500 to-purple-700',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-600',
    },
    {
      icon: <Award className="h-8 w-8" />,
      value: impact.totalDonations,
      unit: 'donations',
      label: 'Total Donations',
      color: 'from-orange-500 to-orange-700',
      bgColor: 'from-orange-50 to-orange-100',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
          <Calculator className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Impact</h2>
          <p className="text-sm text-gray-600">Real environmental and social impact</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${metric.bgColor} p-5 rounded-xl border-2 border-transparent hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center text-white shadow-md`}>
                {metric.icon}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${metric.textColor} bg-white shadow-sm`}>
                {metric.unit}
              </span>
            </div>
            <p className={`text-3xl font-extrabold ${metric.textColor} mb-1`}>
              {metric.value.toLocaleString()}
            </p>
            <p className="text-sm font-semibold text-gray-700">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary-600">{impact.waterSaved}</p>
            <p className="text-xs text-gray-600 font-medium">Liters of Water Saved</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-600">{impact.avgServingsPerDonation}</p>
            <p className="text-xs text-gray-600 font-medium">Avg Servings/Donation</p>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-200">
        <p className="text-xs text-gray-700 leading-relaxed">
          <span className="font-semibold">💡 Did you know?</span> Every meal donated saves approximately 0.5kg of food from waste,
          which prevents 2.5kg of CO₂ emissions and saves 1,000 liters of water. Your contributions make a real difference!
        </p>
      </div>
    </div>
  );
};

export default ImpactCalculator;
