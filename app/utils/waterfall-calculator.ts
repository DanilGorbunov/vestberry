import { ShareClass, FundHolding, ExitScenario, WaterfallResult, ShareClassProceeds, FundProceeds } from "../types"

export function calculateWaterfall(
  shareClasses: ShareClass[],
  fundHoldings: FundHolding[],
  exitScenarios: ExitScenario[]
): WaterfallResult[] {
  return exitScenarios.map(scenario => {
    // Sort share classes by seniority (highest first)
    const sortedShareClasses = [...shareClasses].sort((a, b) => b.seniority - a.seniority)
    
    let remainingProceeds = scenario.exitValue
    const shareClassProceeds: ShareClassProceeds[] = []
    
    // First pass: Calculate liquidation preferences
    for (const shareClass of sortedShareClasses) {
      if (shareClass.liquidationPreference === "None") {
        continue
      }
      
      const totalInvestment = shareClass.sharesOutstanding * shareClass.roundPricePerShare * shareClass.liquidationMultiple
      
      if (remainingProceeds >= totalInvestment) {
        // If there's enough to cover the preference
        if (shareClass.liquidationPreference === "Non-participating") {
          // For non-participating, we'll decide later if they convert
          // For now, just track the preference amount
          shareClassProceeds.push({
            shareClassId: shareClass.id,
            shareClassName: shareClass.name,
            proceeds: totalInvestment,
            proceedsPerShare: totalInvestment / shareClass.sharesOutstanding,
            percentOfTotal: totalInvestment / scenario.exitValue
          })
        } else {
          // For participating, they get their preference
          shareClassProceeds.push({
            shareClassId: shareClass.id,
            shareClassName: shareClass.name,
            proceeds: totalInvestment,
            proceedsPerShare: totalInvestment / shareClass.sharesOutstanding,
            percentOfTotal: totalInvestment / scenario.exitValue
          })
          remainingProceeds -= totalInvestment
        }
      } else {
        // Not enough to cover full preference, they get what's left
        shareClassProceeds.push({
          shareClassId: shareClass.id,
          shareClassName: shareClass.name,
          proceeds: remainingProceeds,
          proceedsPerShare: remainingProceeds / shareClass.sharesOutstanding,
          percentOfTotal: remainingProceeds / scenario.exitValue
        })
        remainingProceeds = 0
        break
      }
    }
    
    // If there are remaining proceeds, distribute to common and converted preferred
    if (remainingProceeds > 0) {
      // Calculate total converted shares
      const totalShares = shareClasses.reduce((sum, sc) => {
        if (sc.liquidationPreference === "None") {
          return sum + sc.sharesOutstanding
        }
        // For non-participating, check if converting is better
        if (sc.liquidationPreference === "Non-participating") {
          const preferenceProceeds = sc.sharesOutstanding * sc.roundPricePerShare * sc.liquidationMultiple
          const convertedShares = sc.sharesOutstanding * sc.conversionRatio
          const convertedProceeds = (convertedShares / getTotalConvertedShares(shareClasses)) * scenario.exitValue
          
          if (convertedProceeds > preferenceProceeds) {
            // Better to convert
            const existingProceedsIndex = shareClassProceeds.findIndex(scp => scp.shareClassId === sc.id)
            if (existingProceedsIndex >= 0) {
              shareClassProceeds.splice(existingProceedsIndex, 1)
            }
            return sum + convertedShares
          }
          // Better to take preference, don't add to converted shares
          return sum
        }
        // For participating, they get both preference and participation
        return sum + (sc.sharesOutstanding * sc.conversionRatio)
      }, 0)
      
      // Distribute remaining proceeds based on ownership
      for (const shareClass of shareClasses) {
        if (shareClass.liquidationPreference === "None") {
          // Common shares get their portion
          const convertedShares = shareClass.sharesOutstanding
          const proceeds = (convertedShares / totalShares) * remainingProceeds
          
          shareClassProceeds.push({
            shareClassId: shareClass.id,
            shareClassName: shareClass.name,
            proceeds: proceeds,
            proceedsPerShare: proceeds / shareClass.sharesOutstanding,
            percentOfTotal: proceeds / scenario.exitValue
          })
        } else if (shareClass.liquidationPreference === "Non-participating") {
          // Check if this class is better off converting
          const preferenceProceeds = shareClass.sharesOutstanding * shareClass.roundPricePerShare * shareClass.liquidationMultiple
          const convertedShares = shareClass.sharesOutstanding * shareClass.conversionRatio
          const convertedProceeds = (convertedShares / totalShares) * remainingProceeds
          
          if (convertedProceeds > preferenceProceeds) {
            // Better to convert
            shareClassProceeds.push({
              shareClassId: shareClass.id,
              shareClassName: shareClass.name,
              proceeds: convertedProceeds,
              proceedsPerShare: convertedProceeds / shareClass.sharesOutstanding,
              percentOfTotal: convertedProceeds / scenario.exitValue
            })
          }
          // Otherwise, they already have their preference proceeds
        } else if (shareClass.liquidationPreference === "Participating") {
          // Participating gets both preference and participation
          const convertedShares = shareClass.sharesOutstanding * shareClass.conversionRatio
          const participationProceeds = (convertedShares / totalShares) * remainingProceeds
          
          // Check if there's a participation cap
          if (shareClass.participationCapMultiple) {
            const totalInvestment = shareClass.sharesOutstanding * shareClass.roundPricePerShare
            const preferenceProceeds = totalInvestment * shareClass.liquidationMultiple
            const maxProceeds = totalInvestment * shareClass.participationCapMultiple
            
            // If preference + participation exceeds cap, cap it
            const existingProceedsIndex = shareClassProceeds.findIndex(scp => scp.shareClassId === shareClass.id)
            if (existingProceedsIndex >= 0) {
              const existingProceeds = shareClassProceeds[existingProceedsIndex].proceeds
              const totalProceeds = existingProceeds + participationProceeds
              
              if (totalProceeds > maxProceeds) {
                // Cap at max proceeds
                const cappedParticipation = maxProceeds - preferenceProceeds
                shareClassProceeds[existingProceedsIndex].proceeds = maxProceeds
                shareClassProceeds[existingProceedsIndex].proceedsPerShare = maxProceeds / shareClass.sharesOutstanding
                shareClassProceeds[existingProceedsIndex].percentOfTotal = maxProceeds / scenario.exitValue
              } else {
                // Add participation to existing preference
                shareClassProceeds[existingProceedsIndex].proceeds += participationProceeds
                shareClassProceeds[existingProceedsIndex].proceedsPerShare = shareClassProceeds[existingProceedsIndex].proceeds / shareClass.sharesOutstanding
                shareClassProceeds[existingProceedsIndex].percentOfTotal = shareClassProceeds[existingProceedsIndex].proceeds / scenario.exitValue
              }
            }
          } else {
            // No cap, add full participation
            const existingProceedsIndex = shareClassProceeds.findIndex(scp => scp.shareClassId === shareClass.id)
            if (existingProceedsIndex >= 0) {
              shareClassProceeds[existingProceedsIndex].proceeds += participationProceeds
              shareClassProceeds[existingProceedsIndex].proceedsPerShare = shareClassProceeds[existingProceedsIndex].proceeds / shareClass.sharesOutstanding
              shareClassProceeds[existingProceedsIndex].percentOfTotal = shareClassProceeds[existingProceedsIndex].proceeds / scenario.exitValue
            }
          }
        }
      }
    }
    
    // Calculate fund proceeds based on share class proceeds
    const fundProceeds: FundProceeds[] = fundHoldings.map(fund => {
      let totalFundProceeds = 0
      const shareClassBreakdown = []
      
      for (const holding of fund.holdings) {
        const shareClassProceed = shareClassProceeds.find(scp => scp.shareClassId === holding.shareClassId)
        if (shareClassProceed) {
          const shareClass = shareClasses.find(sc => sc.id === holding.shareClassId)
          const proceedsPerShare = shareClassProceed.proceedsPerShare
          const fundShareProceeds = proceedsPerShare * holding.shares
          
          totalFundProceeds += fundShareProceeds
          
          shareClassBreakdown.push({
            shareClassId: holding.shareClassId,
            shareClassName: shareClass?.name || 'Unknown',
            proceeds: fundShareProceeds
          })
        }
      }
      
      return {
        fundId: fund.id,
        fundName: fund.fundName,
        proceeds: totalFundProceeds,
        percentOfTotal: totalFundProceeds / scenario.exitValue,
        shareClassBreakdown
      }
    })
    
    return {
      scenarioId: scenario.id,
      exitValue: scenario.exitValue,
      shareClassProceeds,
      fundProceeds
    }
  })
}

// Helper function to get total converted shares
function getTotalConvertedShares(shareClasses: ShareClass[]): number {
  return shareClasses.reduce((sum, sc) => {
    if (sc.liquidationPreference === "None") {
      return sum + sc.sharesOutstanding
    }
    return sum + (sc.sharesOutstanding * sc.conversionRatio)
  }, 0)
}

