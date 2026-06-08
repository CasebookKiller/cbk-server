// src/backtest/strategies/orderFlowStub.ts
// Заглушка OrderFlowEngine для серверных бэктестов
export class OrderFlowEngineStub {
  getDelta(_uid: string): number { return 0; }
  detectAbsorption(_uid: string): null { return null; }
  detectExhaustion(_uid: string): null { return null; }
}