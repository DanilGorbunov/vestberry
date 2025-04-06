"use client"

import { useState, useEffect } from "react"
import { ShareClassForm } from "./components/share-class-form"
import { FundHoldingsForm } from "./components/fund-holdings-form"
import { ExitScenarios } from "./components/exit-scenarios"
import { WaterfallResults } from "./components/waterfall-results"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"
import type { ShareClass, FundHolding, ExitScenario, WaterfallResult } from "./types"
import { calculateWaterfall } from "./utils/waterfall-calculator"

export default function WaterfallAnalysis() {
  const [activeTab, setActiveTab] = useState("inputs")
  const [shareClasses, setShareClasses] = useState<ShareClass[]>([
    {
      id: "1",
      name: "Common",
      liquidationPreference: "None",
      sharesOutstanding: 1000000,
      roundPricePerShare: 0,
      seniority: 1,
      conversionRatio: 1,
      liquidationMultiple: 1,
      participationCapMultiple: undefined,
    },
    {
      id: "2",
      name: "Series A Preferred",
      liquidationPreference: "Non-participating",
      sharesOutstanding: 500000,
      roundPricePerShare: 1.5,
      seniority: 2,
      conversionRatio: 1,
      liquidationMultiple: 1,
      participationCapMultiple: undefined,
    },
  ])
  const [fundHoldings, setFundHoldings] = useState<FundHolding[]>([
    {
      id: "1",
      fundName: "HERMES Fund I",
      holdings: [
        { shareClassId: "1", shares: 200000 },
        { shareClassId: "2", shares: 100000 },
      ],
    },
  ])
  const [selectedFundIndex, setSelectedFundIndex] = useState<number | null>(null)
  const [selectedShareClass, setSelectedShareClass] = useState<string>("")
  const [shareCount, setShareCount] = useState<string>("")
  const [showAddShareDialog, setShowAddShareDialog] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const [exitScenarios, setExitScenarios] = useState<ExitScenario[]>([
    { id: "1", exitValue: 2000000 },
    { id: "2", exitValue: 5000000 },
    { id: "3", exitValue: 10000000 },
  ])

  const [results, setResults] = useState<WaterfallResult[]>([])

  const handleCalculate = () => {
    const calculatedResults = calculateWaterfall(shareClasses, fundHoldings, exitScenarios)
    setResults(calculatedResults)
    setActiveTab("results")
  }

  const handleGenerateScenarios = () => {
    // Calculate total invested capital
    const totalInvested = shareClasses.reduce((sum, shareClass) => {
      if (shareClass.liquidationPreference !== "None") {
        return sum + shareClass.sharesOutstanding * shareClass.roundPricePerShare
      }
      return sum
    }, 0)

    // Generate scenarios at 1x, 2x, 3x, 5x, and 10x of total invested capital
    const newScenarios = [
      { id: "1", exitValue: Math.round(totalInvested) },
      { id: "2", exitValue: Math.round(totalInvested * 2) },
      { id: "3", exitValue: Math.round(totalInvested * 3) },
      { id: "4", exitValue: Math.round(totalInvested * 5) },
      { id: "5", exitValue: Math.round(totalInvested * 10) },
    ]

    setExitScenarios(newScenarios)
  }

  // Function to add share class to a fund
  const addShareClassToFund = () => {
    if (selectedFundIndex === null) return
    if (!selectedShareClass) {
      setValidationError("Please select a share class")
      return
    }
    
    const shareCountNum = parseInt(shareCount)
    if (isNaN(shareCountNum) || shareCountNum <= 0) {
      setValidationError("Number of shares must be a positive integer")
      return
    }
    
    const fund = fundHoldings[selectedFundIndex]
    if (fund.holdings.some(h => h.shareClassId === selectedShareClass)) {
      setValidationError("This fund already owns shares of this class")
      return
    }
    
    setFundHoldings(prev => {
      const newFunds = [...prev]
      newFunds[selectedFundIndex] = {
        ...newFunds[selectedFundIndex],
        holdings: [
          ...newFunds[selectedFundIndex].holdings,
          { shareClassId: selectedShareClass, shares: shareCountNum }
        ]
      }
      return newFunds
    })
    
    // Reset form
    setValidationError(null)
    setSelectedShareClass("")
    setShareCount("")
    setShowAddShareDialog(false)
  }

  // Function to remove share class from a fund
  const removeShareClassFromFund = (fundIndex: number, shareClassId: string) => {
    setFundHoldings(prev => {
      const newFunds = [...prev]
      newFunds[fundIndex] = {
        ...newFunds[fundIndex],
        holdings: newFunds[fundIndex].holdings.filter(h => h.shareClassId !== shareClassId)
      }
      return newFunds
    })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Exit Waterfall Analysis</h1>
          <p className="text-muted-foreground">Calculate proceeds distribution in various exit scenarios</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveTab("inputs")}>
            Edit Inputs
          </Button>
          <Button onClick={handleCalculate}>Calculate Waterfall</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="inputs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Share Classes</CardTitle>
              <CardDescription>Define all share classes and their liquidation preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <ShareClassForm shareClasses={shareClasses} setShareClasses={setShareClasses} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fund Holdings</CardTitle>
              <CardDescription>Specify how many shares each of your funds owns</CardDescription>
            </CardHeader>
            <CardContent>
              <FundHoldingsForm
                fundHoldings={fundHoldings}
                setFundHoldings={setFundHoldings}
                shareClasses={shareClasses}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Exit Scenarios</CardTitle>
                <CardDescription>Define exit values to analyze</CardDescription>
              </div>
              <Button variant="outline" onClick={handleGenerateScenarios}>
                Generate Scenarios
              </Button>
            </CardHeader>
            <CardContent>
              <ExitScenarios exitScenarios={exitScenarios} setExitScenarios={setExitScenarios} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Share Class Holdings</CardTitle>
              <CardDescription>Manage share classes for HERMES Fund I</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fundHoldings.map((fund, fundIndex) => (
                  <Card key={fund.id}>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">{fund.fundName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label className="text-base font-medium">Share Class Holdings</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedFundIndex(fundIndex)
                                setShowAddShareDialog(true)
                                setValidationError(null)
                              }}
                            >
                              Add Share Class
                            </Button>
                          </div>

                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Share Class</TableHead>
                                <TableHead>Number of Shares</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {fund.holdings.map((holding) => {
                                const shareClass = shareClasses.find(sc => sc.id === holding.shareClassId)
                                return (
                                  <TableRow key={holding.shareClassId}>
                                    <TableCell>{shareClass?.name}</TableCell>
                                    <TableCell>{holding.shares.toLocaleString()}</TableCell>
                                    <TableCell>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeShareClassFromFund(fundIndex, holding.shareClassId)}
                                      >
                                        Remove
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                              {fund.holdings.length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                                    No share classes added
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Share Class Dialog */}
          <Dialog open={showAddShareDialog} onOpenChange={setShowAddShareDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Add Share Class to {selectedFundIndex !== null ? fundHoldings[selectedFundIndex]?.fundName : ""}
                </DialogTitle>
              </DialogHeader>
              
              {validationError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Share Class</Label>
                  <Select
                    value={selectedShareClass}
                    onValueChange={setSelectedShareClass}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a share class" />
                    </SelectTrigger>
                    <SelectContent>
                      {shareClasses
                        .filter(shareClass => 
                          selectedFundIndex !== null && 
                          !fundHoldings[selectedFundIndex].holdings.some(h => h.shareClassId === shareClass.id)
                        )
                        .map(shareClass => (
                          <SelectItem key={shareClass.id} value={shareClass.id}>
                            {shareClass.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Number of Shares</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Enter number of shares"
                    value={shareCount}
                    onChange={(e) => setShareCount(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddShareDialog(false)
                    setValidationError(null)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={addShareClassToFund}>
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="results">
          <WaterfallResults
            results={results}
            shareClasses={shareClasses}
            fundHoldings={fundHoldings}
            exitScenarios={exitScenarios}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

