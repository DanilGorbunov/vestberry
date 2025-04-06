export type LiquidationPreferenceType = "Non-participating" | "Participating" | "None"

export interface ShareClass {
  id: string
  name: string
  liquidationPreference: LiquidationPreferenceType
  sharesOutstanding: number
  roundPricePerShare: number
  seniority: number
  conversionRatio: number
  liquidationMultiple: number
  participationCapMultiple?: number
}

export interface ShareHolding {
  shareClassId: string
  shares: number
}

export interface FundHolding {
  id: string
  fundName: string
  holdings: ShareHolding[]
}

export interface ExitScenario {
  id: string
  exitValue: number
}

export interface ShareClassProceeds {
  shareClassId: string
  shareClassName: string
  proceeds: number
  proceedsPerShare: number
  percentOfTotal: number
}

export interface FundProceeds {
  fundId: string
  fundName: string
  proceeds: number
  percentOfTotal: number
  shareClassBreakdown: {
    shareClassId: string
    shareClassName: string
    proceeds: number
  }[]
}

export interface WaterfallResult {
  scenarioId: string
  exitValue: number
  shareClassProceeds: ShareClassProceeds[]
  fundProceeds: FundProceeds[]
}

