"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ShareClass, FundHolding, ExitScenario, WaterfallResult } from "../types"
import { formatCurrency, formatPercentage } from "../utils/formatters"
import { BarChart, PieChart } from "./charts"

interface WaterfallResultsProps {
  results: WaterfallResult[]
  shareClasses: ShareClass[]
  fundHoldings: FundHolding[]
  exitScenarios: ExitScenario[]
}

export function WaterfallResults({ results, shareClasses, fundHoldings, exitScenarios }: WaterfallResultsProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(results.length > 0 ? results[0].scenarioId : "")

  const selectedResult = results.find((r) => r.scenarioId === selectedScenarioId)

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-64">
            <h3 className="text-lg font-medium text-muted-foreground">No results to display</h3>
            <p className="text-sm text-muted-foreground">Please calculate the waterfall first</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getExitValueForScenario = (scenarioId: string) => {
    const scenario = exitScenarios.find((s) => s.id === scenarioId)
    return scenario ? formatCurrency(scenario.exitValue) : "N/A"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Waterfall Analysis Results</CardTitle>
              <CardDescription>Proceeds distribution at different exit values</CardDescription>
            </div>
            <div className="w-[200px]">
              <Select value={selectedScenarioId} onValueChange={setSelectedScenarioId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exit scenario" />
                </SelectTrigger>
                <SelectContent>
                  {results.map((result) => (
                    <SelectItem key={result.scenarioId} value={result.scenarioId}>
                      Exit: {getExitValueForScenario(result.scenarioId)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedResult && (
            <Tabs defaultValue="share-classes">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="share-classes">Share Classes</TabsTrigger>
                <TabsTrigger value="funds">Funds</TabsTrigger>
              </TabsList>

              <TabsContent value="share-classes" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Share Class Proceeds</CardTitle>
                      <CardDescription>
                        Exit Value: {getExitValueForScenario(selectedResult.scenarioId)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PieChart
                        data={selectedResult.shareClassProceeds.map((scp) => ({
                          name: scp.shareClassName,
                          value: scp.proceeds,
                        }))}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Proceeds per Share</CardTitle>
                      <CardDescription>Value each share receives in this scenario</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <BarChart
                        data={selectedResult.shareClassProceeds.map((scp) => ({
                          name: scp.shareClassName,
                          value: scp.proceedsPerShare,
                        }))}
                        formatValue={(value) => formatCurrency(value)}
                      />
                    </CardContent>
                  </Card>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Share Class</TableHead>
                      <TableHead>Total Proceeds</TableHead>
                      <TableHead>Proceeds Per Share</TableHead>
                      <TableHead>% of Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedResult.shareClassProceeds.map((scp, index) => (
                      <TableRow key={`${scp.shareClassId}-${index}`}>
                        <TableCell>{scp.shareClassName}</TableCell>
                        <TableCell>{formatCurrency(scp.proceeds)}</TableCell>
                        <TableCell>{formatCurrency(scp.proceedsPerShare)}</TableCell>
                        <TableCell>{formatPercentage(scp.percentOfTotal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="funds" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Fund Proceeds</CardTitle>
                      <CardDescription>
                        Exit Value: {getExitValueForScenario(selectedResult.scenarioId)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PieChart
                        data={selectedResult.fundProceeds.map((fp) => ({
                          name: fp.fundName,
                          value: fp.proceeds,
                        }))}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Fund Breakdown</CardTitle>
                      <CardDescription>Proceeds by share class for each fund</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <BarChart
                        data={selectedResult.fundProceeds.map((fp) => ({
                          name: fp.fundName,
                          value: fp.proceeds,
                        }))}
                        formatValue={(value) => formatCurrency(value)}
                      />
                    </CardContent>
                  </Card>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fund</TableHead>
                      <TableHead>Total Proceeds</TableHead>
                      <TableHead>% of Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedResult.fundProceeds.map((fp) => (
                      <TableRow key={fp.fundId}>
                        <TableCell>{fp.fundName}</TableCell>
                        <TableCell>{formatCurrency(fp.proceeds)}</TableCell>
                        <TableCell>{formatPercentage(fp.percentOfTotal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Breakdown by Fund</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedResult.fundProceeds.map((fp) => (
                      <div key={fp.fundId} className="mb-6">
                        <h3 className="text-lg font-medium mb-2">{fp.fundName}</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Share Class</TableHead>
                              <TableHead>Proceeds</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {fp.shareClassBreakdown.map((breakdown) => (
                              <TableRow key={breakdown.shareClassId}>
                                <TableCell>{breakdown.shareClassName}</TableCell>
                                <TableCell>{formatCurrency(breakdown.proceeds)}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell className="font-bold">Total</TableCell>
                              <TableCell className="font-bold">{formatCurrency(fp.proceeds)}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

