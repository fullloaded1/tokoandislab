import { getEvaluations, getScoreLeaderboard, getNonReadyStockProducts } from "./actions";
import { prisma } from "@/lib/db";
import StockEvalClient from "./StockEvalClient";

export default async function StockEvaluationPage() {
  const [evaluations, leaderboard, nonReadyProducts, readyStockCount] = await Promise.all([
    getEvaluations(),
    getScoreLeaderboard(),
    getNonReadyStockProducts(),
    prisma.product.count({ where: { isReadyStock: true } }),
  ]);

  return (
    <StockEvalClient
      initialEvaluations={evaluations}
      leaderboard={leaderboard}
      nonReadyProducts={nonReadyProducts}
      readyStockCount={readyStockCount}
    />
  );
}
