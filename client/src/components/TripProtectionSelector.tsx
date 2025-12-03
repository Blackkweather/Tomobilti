import { Card, CardContent } from "./ui/card";
import { Shield, Check } from "lucide-react";

interface TripProtectionSelectorProps {
  selectedTier: "basic" | "standard" | "premium";
  onSelect: (tier: "basic" | "standard" | "premium") => void;
  dailyRate: number;
}

export default function TripProtectionSelector({ selectedTier, onSelect, dailyRate }: TripProtectionSelectorProps) {
  const tiers = [
    {
      id: "basic" as const,
      name: "Basic Protection",
      price: dailyRate * 0.10,
      coverage: "£3,000",
      features: ["£3,000 damage coverage", "24/7 roadside assistance", "Basic theft protection"]
    },
    {
      id: "standard" as const,
      name: "Standard Protection",
      price: dailyRate * 0.20,
      coverage: "£10,000",
      features: ["£10,000 damage coverage", "24/7 roadside assistance", "Full theft protection", "Windscreen coverage"]
    },
    {
      id: "premium" as const,
      name: "Premium Protection",
      price: dailyRate * 0.35,
      coverage: "Unlimited",
      features: ["Unlimited damage coverage", "24/7 roadside assistance", "Full theft protection", "Windscreen coverage", "Personal injury protection", "Zero excess"]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold">Trip Protection (Required)</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className={`cursor-pointer transition-all ${
              selectedTier === tier.id
                ? "border-purple-600 border-2 shadow-lg"
                : "border-gray-200 hover:border-purple-300"
            }`}
            onClick={() => onSelect(tier.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{tier.name}</h4>
                  <p className="text-sm text-gray-600">Up to {tier.coverage}</p>
                </div>
                {selectedTier === tier.id && (
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="text-2xl font-bold text-purple-600 mb-3">
                £{tier.price.toFixed(2)}<span className="text-sm text-gray-600">/day</span>
              </div>
              
              <ul className="space-y-2">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
