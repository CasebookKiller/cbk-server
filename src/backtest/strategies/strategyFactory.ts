// src/main/services/backtest/strategies/strategyFactory.ts
import type { VolumeProfileLevels } from '../../../../volumeProfileEngine';
import type { IBacktestStrategy } from '../backtestEngine';
import { VolumeAccumulationStrategy } from './VolumeAccumulationStrategy';
import { TrendStrategy } from './TrendStrategy';
import { TrendStrategyPro } from './TrendStrategyPro';
import { POCPullbackStrategy } from './POCPullbackStrategy';
import { DailyVAReversalStrategy } from './DailyVAReversalStrategy';
import { FVGVolumeStrategy } from './FVGVolumeStrategy';
import { RejectionStrategy } from './RejectionStrategy';
import { InitialBalanceStrategy } from './InitialBalanceStrategy';
import { VABreakoutRetestStrategy } from './VABreakoutRetestStrategy';
import { SFPStrategy } from './SFPStrategy';
import { AnchoredVWAPStrategy } from './AnchoredVWAPStrategy';
import { AbsorptionStrategy } from './AbsorptionStrategy';
import { ExhaustionStrategy } from './ExhaustionStrategy';
import { OrderFlowEngine } from '../../../orderFlowEngine';

type StrategyFactory = (
  instrumentUid: string,
  profile: VolumeProfileLevels | null,
  orderFlow?: OrderFlowEngine,
  options?: any
) => IBacktestStrategy;

export function createStrategy(
  name: string,
  instrumentUid: string,
  profile: VolumeProfileLevels | null,
  orderFlow?: OrderFlowEngine,
  options?: any
): IBacktestStrategy {
  switch (name) {
    case 'volume_accumulation': return new VolumeAccumulationStrategy(instrumentUid, profile, options);
    case 'trend': return new TrendStrategy(instrumentUid, profile, options);
    case 'trend_pro': return new TrendStrategyPro(instrumentUid, profile);
    case 'poc_pullback': return new POCPullbackStrategy(instrumentUid, profile);
    case 'daily_va_return': return new DailyVAReversalStrategy(instrumentUid, profile);
    case 'fvg_volume': return new FVGVolumeStrategy(instrumentUid, profile);
    case 'rejection': return new RejectionStrategy(instrumentUid, profile);
    case 'initial_balance': return new InitialBalanceStrategy(instrumentUid, profile, options?.ibMinutes || 60);
    case 'va_breakout_retest': return new VABreakoutRetestStrategy(instrumentUid, profile);
    case 'sfp': return new SFPStrategy(instrumentUid, profile);
    case 'anchored_vwap': return new AnchoredVWAPStrategy(instrumentUid, profile, options?.anchorTime ? new Date(options.anchorTime) : undefined);
    case 'absorption': return new AbsorptionStrategy(instrumentUid, profile, orderFlow!);
    case 'exhaustion': return new ExhaustionStrategy(instrumentUid, profile, orderFlow!);
    default: throw new Error(`Unknown strategy: ${name}`);
  }
}

export function getAvailableStrategies(): string[] {
  return [
    'volume_accumulation',
    'trend',
    'trend_pro',
    'poc_pullback',
    'daily_va_return',
    'fvg_volume',
    'rejection',
    'initial_balance',
    'va_breakout_retest',
    'sfp',
    'anchored_vwap',
    'absorption',
    'exhaustion',
  ];
}