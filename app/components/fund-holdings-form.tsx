// "use client"

// import { useState, useEffect, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent } from "@/components/ui/card"
// import type { FundHolding, ShareClass, ShareHolding } from "../types"
// import { PlusCircle, Trash2 } from "lucide-react"

// interface FundHoldingsFormProps {
//   fundHoldings: FundHolding[]
//   setFundHoldings: (fundHoldings: FundHolding[]) => void
//   shareClasses: ShareClass[]
// }

// export function FundHoldingsForm({ fundHoldings, setFundHoldings, shareClasses }: FundHoldingsFormProps) {
//   const [newFundName, setNewFundName] = useState("")
//   const initialRenderRef = useRef(true)

//   const handleAddFund = () => {
//     if (!newFundName) return

//     const newHoldings: ShareHolding[] = shareClasses.map((sc) => ({
//       shareClassId: sc.id,
//       shares: 0,
//     }))

//     const newFund: FundHolding = {
//       id: Date.now().toString(),
//       fundName: newFundName,
//       holdings: newHoldings,
//     }

//     setFundHoldings([...fundHoldings, newFund])
//     setNewFundName("")
//   }

//   const handleRemoveFund = (id: string) => {
//     setFundHoldings(fundHoldings.filter((fund) => fund.id !== id))
//   }

//   const handleUpdateHolding = (fundId: string, shareClassId: string, shares: number) => {
//     setFundHoldings(
//       fundHoldings.map((fund) => {
//         if (fund.id === fundId) {
//           const updatedHoldings = fund.holdings.map((holding) => {
//             if (holding.shareClassId === shareClassId) {
//               return { ...holding, shares }
//             }
//             return holding
//           })
//           return { ...fund, holdings: updatedHoldings }
//         }
//         return fund
//       }),
//     )
//   }

//   // Ensure all funds have holdings for all share classes
//   useEffect(() => {
//     // Skip the first render to avoid an initial unnecessary update
//     if (initialRenderRef.current) {
//       initialRenderRef.current = false
//       return
//     }

//     if (shareClasses.length > 0 && fundHoldings.length > 0) {
//       let needsUpdate = false
//       const updatedFundHoldings = fundHoldings.map((fund) => {
//         const existingShareClassIds = fund.holdings.map((h) => h.shareClassId)

//         const missingHoldings = shareClasses
//           .filter((sc) => !existingShareClassIds.includes(sc.id))
//           .map((sc) => ({ shareClassId: sc.id, shares: 0 }))

//         if (missingHoldings.length > 0) {
//           needsUpdate = true
//           return {
//             ...fund,
//             holdings: [...fund.holdings, ...missingHoldings],
//           }
//         }

//         return fund
//       })

//       // Only update state if there are actually changes to make
//       if (needsUpdate) {
//         setFundHoldings(updatedFundHoldings)
//       }
//     }
//   }, [shareClasses, fundHoldings, setFundHoldings])

//   return (
//     <div className="space-y-6">
//       {fundHoldings.map((fund) => (
//         <Card key={fund.id} className="mb-4">
//           <CardContent className="pt-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-medium">{fund.fundName}</h3>
//               <Button variant="ghost" size="icon" onClick={() => handleRemoveFund(fund.id)}>
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </div>

//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Share Class</TableHead>
//                   <TableHead>Shares Owned</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {fund.holdings
//                   .filter((holding) => shareClasses.some((sc) => sc.id === holding.shareClassId))
//                   .map((holding) => {
//                     const shareClass = shareClasses.find((sc) => sc.id === holding.shareClassId)
//                     return (
//                       <TableRow key={holding.shareClassId}>
//                         <TableCell>{shareClass?.name || "Unknown"}</TableCell>
//                         <TableCell>
//                           <Input
//                             type="number"
//                             value={holding.shares}
//                             onChange={(e) =>
//                               handleUpdateHolding(fund.id, holding.shareClassId, Number.parseInt(e.target.value) || 0)
//                             }
//                           />
//                         </TableCell>
//                       </TableRow>
//                     )
//                   })}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       ))}

//       <Card className="border-dashed">
//         <CardContent className="pt-6">
//           <div className="grid grid-cols-4 gap-4">
//             <div className="col-span-3">
//               <Label htmlFor="new-fund">Fund Name</Label>
//               <Input
//                 id="new-fund"
//                 value={newFundName}
//                 onChange={(e) => setNewFundName(e.target.value)}
//                 placeholder="e.g. HERMES Fund II"
//               />
//             </div>
//             <div className="flex items-end">
//               <Button onClick={handleAddFund} className="w-full">
//                 <PlusCircle className="mr-2 h-4 w-4" />
//                 Add Fund
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, PlusCircle, Trash2 } from "lucide-react"
import type { FundHolding, ShareClass } from "../types"

interface FundHoldingsFormProps {
  fundHoldings: FundHolding[]
  setFundHoldings: (fundHoldings: FundHolding[]) => void
  shareClasses: ShareClass[]
}

export function FundHoldingsForm({ fundHoldings, setFundHoldings, shareClasses }: FundHoldingsFormProps) {
  const [newFundName, setNewFundName] = useState("")
  const [showWarning, setShowWarning] = useState(false)
  const [warningMessage, setWarningMessage] = useState("")
  const initialRenderRef = useRef(true)

  // State for the new share class being added to a fund
  const [addingShareClass, setAddingShareClass] = useState<{
    fundId: string | null
    shareClassId: string
    shares: number
  }>({
    fundId: null,
    shareClassId: "",
    shares: 0,
  })

  const handleAddFund = () => {
    if (!newFundName) return

    const newFund: FundHolding = {
      id: Date.now().toString(),
      fundName: newFundName,
      holdings: [],
    }

    setFundHoldings([...fundHoldings, newFund])
    setNewFundName("")
  }

  const handleRemoveFund = (id: string) => {
    setFundHoldings(fundHoldings.filter((fund) => fund.id !== id))
  }

  const handleRemoveHolding = (fundId: string, shareClassId: string) => {
    setFundHoldings(
      fundHoldings.map((fund) => {
        if (fund.id === fundId) {
          return {
            ...fund,
            holdings: fund.holdings.filter((holding) => holding.shareClassId !== shareClassId),
          }
        }
        return fund
      }),
    )
  }

  const handleUpdateHolding = (fundId: string, shareClassId: string, shares: number) => {
    if (shares < 0) return

    setFundHoldings(
      fundHoldings.map((fund) => {
        if (fund.id === fundId) {
          const updatedHoldings = fund.holdings.map((holding) => {
            if (holding.shareClassId === shareClassId) {
              return { ...holding, shares }
            }
            return holding
          })
          return { ...fund, holdings: updatedHoldings }
        }
        return fund
      }),
    )
  }

  const handleAddShareClassToFund = (fundId: string) => {
    // Reset the adding state with the current fundId
    setAddingShareClass({
      fundId,
      shareClassId: "",
      shares: 0,
    })
  }

  const handleShareClassSelect = (shareClassId: string) => {
    setAddingShareClass({
      ...addingShareClass,
      shareClassId,
    })
  }

  const handleSharesChange = (shares: number) => {
    setAddingShareClass({
      ...addingShareClass,
      shares: shares < 0 ? 0 : shares,
    })
  }

  const handleConfirmAddShareClass = () => {
    if (!addingShareClass.fundId || !addingShareClass.shareClassId || addingShareClass.shares <= 0) {
      setWarningMessage("Please select a share class and enter a positive number of shares.")
      setShowWarning(true)
      return
    }

    const fund = fundHoldings.find((f) => f.id === addingShareClass.fundId)
    if (!fund) return

    // Check if this share class is already in the fund
    if (fund.holdings.some((h) => h.shareClassId === addingShareClass.shareClassId)) {
      setWarningMessage("This share class is already added to the fund. Please edit the existing entry instead.")
      setShowWarning(true)
      return
    }

    // Add the share class to the fund
    setFundHoldings(
      fundHoldings.map((fund) => {
        if (fund.id === addingShareClass.fundId) {
          return {
            ...fund,
            holdings: [
              ...fund.holdings,
              {
                shareClassId: addingShareClass.shareClassId,
                shares: addingShareClass.shares,
              },
            ],
          }
        }
        return fund
      }),
    )

    // Reset the adding state
    setAddingShareClass({
      fundId: null,
      shareClassId: "",
      shares: 0,
    })
  }

  // Check if any share classes have been removed and update fund holdings accordingly
  useEffect(() => {
    // Skip the first render to avoid an initial unnecessary update
    if (initialRenderRef.current) {
      initialRenderRef.current = false
      return
    }

    let hasRemovedClasses = false
    const updatedFundHoldings = fundHoldings.map((fund) => {
      const validHoldings = fund.holdings.filter((holding) => shareClasses.some((sc) => sc.id === holding.shareClassId))

      if (validHoldings.length !== fund.holdings.length) {
        hasRemovedClasses = true
      }

      return {
        ...fund,
        holdings: validHoldings,
      }
    })

    if (hasRemovedClasses) {
      setWarningMessage(
        "Some share classes have been removed from the main list and were automatically removed from funds.",
      )
      setShowWarning(true)
      setFundHoldings(updatedFundHoldings)
    }
  }, [shareClasses, setFundHoldings])

  // Get available share classes for a specific fund (exclude already added ones)
  const getAvailableShareClasses = (fundId: string) => {
    const fund = fundHoldings.find((f) => f.id === fundId)
    if (!fund) return shareClasses

    const alreadyAddedIds = fund.holdings.map((h) => h.shareClassId)
    return shareClasses.filter((sc) => !alreadyAddedIds.includes(sc.id))
  }

  return (
    <div className="space-y-6">
      {showWarning && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{warningMessage}</AlertDescription>
          <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => setShowWarning(false)}>
            Dismiss
          </Button>
        </Alert>
      )}

      {fundHoldings.map((fund) => (
        <Card key={fund.id} className="mb-4">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{fund.fundName}</h3>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveFund(fund.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {fund.holdings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Share Class</TableHead>
                    <TableHead>Shares Owned</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fund.holdings.map((holding) => {
                    const shareClass = shareClasses.find((sc) => sc.id === holding.shareClassId)
                    return (
                      <TableRow key={holding.shareClassId}>
                        <TableCell>{shareClass?.name || "Unknown"}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={holding.shares}
                            onChange={(e) =>
                              handleUpdateHolding(fund.id, holding.shareClassId, Number.parseInt(e.target.value) || 0)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveHolding(fund.id, holding.shareClassId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No share classes added yet. Add a share class below.
              </div>
            )}

            {addingShareClass.fundId === fund.id ? (
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`share-class-${fund.id}`}>Share Class</Label>
                  <Select value={addingShareClass.shareClassId} onValueChange={handleShareClassSelect}>
                    <SelectTrigger id={`share-class-${fund.id}`}>
                      <SelectValue placeholder="Select share class" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableShareClasses(fund.id).map((sc) => (
                        <SelectItem key={sc.id} value={sc.id}>
                          {sc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`shares-${fund.id}`}>Number of Shares</Label>
                  <Input
                    id={`shares-${fund.id}`}
                    type="number"
                    value={addingShareClass.shares}
                    onChange={(e) => handleSharesChange(Number.parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleConfirmAddShareClass} className="flex-1">
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setAddingShareClass({ fundId: null, shareClassId: "", shares: 0 })}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => handleAddShareClassToFund(fund.id)}
                className="mt-4"
                disabled={getAvailableShareClasses(fund.id).length === 0}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Share Class
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3">
              <Label htmlFor="new-fund">Fund Name</Label>
              <Input
                id="new-fund"
                value={newFundName}
                onChange={(e) => setNewFundName(e.target.value)}
                placeholder="e.g. HERMES Fund II"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddFund} className="w-full" disabled={!newFundName}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Fund
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

