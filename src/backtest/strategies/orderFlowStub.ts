// src/backtest/strategies/orderFlowStub.ts
// Заглушка OrderFlowEngine для серверных бэктестов

export class OrderFlowEngine {
  getDelta(_uid: string): number { return 0; }

  detectAbsorption(_uid: string): { side: string; priceLevel: number } | null {
    return null;
  }

  detectExhaustion(_uid: string): { type: 'bearish' | 'bullish'; extremePrice: number } | null {
    return null;
  }
}