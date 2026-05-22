const restrictedTerms = [
  'guaranteed income',
  'get rich',
  'certified',
  'warranty',
  'safe for all uses',
  'chemical safe',
  'no risk',
  'guaranteed results',
  'exact coverage',
  'exact price'
];

export function scoreContentRisk(input: string): {
  riskScore: number;
  flags: string[];
  requiresReview: boolean;
} {
  const normalized = input.toLowerCase();
  const flags = restrictedTerms.filter((term) => normalized.includes(term.toLowerCase()));
  const riskScore = flags.length * 20;
  return { riskScore, flags, requiresReview: flags.length > 0 };
}
