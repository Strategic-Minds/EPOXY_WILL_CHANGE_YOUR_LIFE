export function scoreWinner(metrics: {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  clicks?: number;
  leads?: number;
}) {
  const views = metrics.views ?? 0;
  if (views === 0) return 0;

  const engagement =
    (metrics.likes ?? 0) +
    (metrics.comments ?? 0) * 3 +
    (metrics.shares ?? 0) * 5 +
    (metrics.saves ?? 0) * 5 +
    (metrics.clicks ?? 0) * 8 +
    (metrics.leads ?? 0) * 20;

  return Number(((engagement / views) * 100).toFixed(2));
}

export function scaleDecision(score: number) {
  if (score >= 8) return 'scale';
  if (score >= 3) return 'revise';
  return 'kill_or_rework';
}
