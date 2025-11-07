export const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export const AREA_UNITS = [
  { label: 'Acre', value: 'acre' },
  { label: 'Hectare', value: 'hectare' },
  { label: 'Katha', value: 'katha' },
  { label: 'Bigha', value: 'bigha' },
  { label: 'Gumha', value: 'gumha' },
];

export const LAND_HOLDING_OPTIONS = [
  { label: 'Owned by the farmer', value: 'owned' },
  { label: 'Co-owned by farmer and family', value: 'co-owned' },
  { label: 'Shared (Neighbouring farmers)', value: 'shared' },
];

export const FLOWERS = [
  { label: 'Marigold', value: 'marigold' },
  { label: 'Sunflower', value: 'sunflower' },
  { label: 'Rose', value: 'rose' },
  { label: 'Jasmine', value: 'jasmine' },
  { label: 'Lily', value: 'lily' },
  { label: 'Lotus', value: 'lotus' },
  { label: 'Hibiscus', value: 'hibiscus' },
  { label: 'Orchid', value: 'orchid' },
  { label: 'Dahlia', value: 'dahlia' },
  { label: 'Tulip', value: 'tulip' },
];

export const HYBRID_VARIETIES = [
  { label: 'Hybrid Variety 1', value: 'hybrid1' },
  { label: 'Hybrid Variety 2', value: 'hybrid2' },
  { label: 'Hybrid Variety 3', value: 'hybrid3' },
  { label: 'Custom Variety', value: 'custom' },
];

export const NEGATIVE_REASONS = [
  { label: 'Pest or disease infestation (e.g., Varroa mites, wax moths)', value: 'pest_disease' },
  { label: 'Poor colony health or bee losses', value: 'poor_health' },
  { label: 'Low honey yield', value: 'low_yield' },
  { label: 'Lack of training or technical knowledge', value: 'lack_training' },
  { label: 'Inadequate forage or floral resources', value: 'inadequate_forage' },
  { label: 'High cost of inputs or equipment', value: 'high_cost' },
  { label: 'Difficulty managing time or labor', value: 'time_management' },
  { label: 'Safety concerns (e.g., bee stings, pesticide exposure)', value: 'safety_concerns' },
  { label: 'Marketing or selling challenges', value: 'marketing_challenges' },
  { label: 'Other (please specify)', value: 'other' },
];

export const FERTILIZER_CLASSES = [
  { label: 'Nitrogenous (N fertilizers) - Urea, Ammonium Sulphate, CAN', value: 'nitrogenous' },
  { label: 'Phosphate (P fertilizers) - SSP, DAP', value: 'phosphate' },
  { label: 'Potassic (K fertilizers) - MOP, SOP', value: 'potassic' },
  { label: 'Complex / Compound NPK - 10-26-26, 12-32-16, 19-19-19, 20-20-20-13', value: 'complex_npk' },
  { label: 'Coated / Controlled release/Nitrification inhibitor/Urease inhibitor', value: 'coated_controlled' },
  { label: 'Micronutrient Fertilizers - Zinc Sulphate, Borax, Copper Sulphate', value: 'micronutrient' },
  { label: 'Foliar / Liquid Nutrient Sprays/Liquid organic fertilizer - Leaf meal, amino acid, seaweed', value: 'foliar_liquid' },
  { label: 'Unknown / Mixed formulations - "generic formula", "leaf meal"', value: 'unknown_mixed' },
];

export const PESTICIDE_CLASSES = [
  { label: 'Organophosphates/Chlorpyrifos (Dursban), Dimethoate, Malathion', value: 'organophosphates' },
  { label: 'Carbamates/Carbaryl (Sevin), Carbofuran', value: 'carbamates' },
  { label: 'Pyrethroids, Allethrin, Permethrin/Cypermethrin, Synthetic Pyrethroids', value: 'pyrethroids' },
  { label: 'Sulfonylureas Sulfosulfuron (Culver)', value: 'sulfonylureas' },
  { label: 'Fungicides/Mancozeb (Indofil M-45), Carbendazim, Tebuconazole', value: 'fungicides' },
  { label: 'Herbicides/Glyphosate (Roundup), 2,4-D, Paraquat', value: 'herbicides' },
  { label: 'Insect Growth Regulators Diflubenzuron, Cyfluthrin, Chlorantraniliprole', value: 'insect_growth_regulators' },
  { label: 'Unknown / Pest target based/For "soil pests", "for Bollworm"', value: 'unknown_pest_based' },
  { label: 'Neonicotinoids/Imidacloprid (Confidor), Thiamethoxam (Actara), Clothianidin', value: 'neonicotinoids' },
  { label: 'Pyrimidinols/Cyprodinil+Fludioxonil, Dodine, Lambda cyhalothrin (Karate)', value: 'pyrimidinols' },
];

export const POTENTIAL_RISKS = [
  { label: 'Submerged areas', value: 'submerged_areas' },
  { label: 'Excessive use of chemicals by self', value: 'excessive_chemicals_self' },
  { label: 'Excessive use of chemicals by neighbours', value: 'excessive_chemicals_neighbours' },
  { label: 'Nearby factories', value: 'nearby_factories' },
  { label: 'Nearby road traffic', value: 'nearby_road_traffic' },
  { label: 'No guard, Possibility of theft', value: 'no_guard_theft' },
  { label: 'Animal attacks', value: 'animal_attacks' },
  { label: 'Scared of honey bees', value: 'scared_bees' },
];