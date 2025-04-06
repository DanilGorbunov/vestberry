"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ShareClass, LiquidationPreferenceType } from "../types"
import { PlusCircle, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ShareClassFormProps {
  shareClasses: ShareClass[]
  setShareClasses: (shareClasses: ShareClass[]) => void
}

export function ShareClassForm({ shareClasses, setShareClasses }: ShareClassFormProps) {
  const [newShareClass, setNewShareClass] = useState<ShareClass>({
    id: "",
    name: "",
    liquidationPreference: "None",
    sharesOutstanding: 0,
    roundPricePerShare: 0,
    seniority: 1,
    conversionRatio: 1,
    liquidationMultiple: 1,
    participationCapMultiple: undefined,
  })

  const handleAddShareClass = () => {
    const id = Date.now().toString()
    setShareClasses([...shareClasses, { ...newShareClass, id }])
    setNewShareClass({
      id: "",
      name: "",
      liquidationPreference: "None",
      sharesOutstanding: 0,
      roundPricePerShare: 0,
      seniority: 1,
      conversionRatio: 1,
      liquidationMultiple: 1,
      participationCapMultiple: undefined,
    })
  }

  const handleRemoveShareClass = (id: string) => {
    setShareClasses(shareClasses.filter((sc) => sc.id !== id))
  }

  const handleUpdateShareClass = (id: string, field: keyof ShareClass, value: any) => {
    setShareClasses(shareClasses.map((sc) => (sc.id === id ? { ...sc, [field]: value } : sc)))
  }

  const isPreferenceDisabled = (preference: LiquidationPreferenceType) => preference === "None"

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Share Class</TableHead>
            <TableHead>Liquidation Preference</TableHead>
            <TableHead>Shares Outstanding</TableHead>
            <TableHead>Round Price Per Share</TableHead>
            <TableHead>Seniority</TableHead>
            <TableHead>Conversion Ratio</TableHead>
            <TableHead>Liquidation Multiple</TableHead>
            <TableHead>Participation Cap</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shareClasses.map((shareClass) => (
            <TableRow key={shareClass.id}>
              <TableCell>
                <Input
                  value={shareClass.name}
                  onChange={(e) => handleUpdateShareClass(shareClass.id, "name", e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={shareClass.liquidationPreference}
                  onValueChange={(value) =>
                    handleUpdateShareClass(shareClass.id, "liquidationPreference", value as LiquidationPreferenceType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Non-participating">Non-participating</SelectItem>
                    <SelectItem value="Participating">Participating</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={shareClass.sharesOutstanding}
                  onChange={(e) =>
                    handleUpdateShareClass(shareClass.id, "sharesOutstanding", Number.parseInt(e.target.value) || 0)
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={shareClass.roundPricePerShare}
                  onChange={(e) =>
                    handleUpdateShareClass(shareClass.id, "roundPricePerShare", Number.parseFloat(e.target.value) || 0)
                  }
                  disabled={isPreferenceDisabled(shareClass.liquidationPreference)}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={shareClass.seniority}
                  onChange={(e) =>
                    handleUpdateShareClass(shareClass.id, "seniority", Number.parseInt(e.target.value) || 1)
                  }
                  disabled={isPreferenceDisabled(shareClass.liquidationPreference)}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={shareClass.conversionRatio}
                  onChange={(e) =>
                    handleUpdateShareClass(shareClass.id, "conversionRatio", Number.parseFloat(e.target.value) || 1)
                  }
                  disabled={isPreferenceDisabled(shareClass.liquidationPreference)}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={shareClass.liquidationMultiple}
                  onChange={(e) =>
                    handleUpdateShareClass(shareClass.id, "liquidationMultiple", Number.parseFloat(e.target.value) || 1)
                  }
                  disabled={isPreferenceDisabled(shareClass.liquidationPreference)}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={shareClass.participationCapMultiple || ""}
                  onChange={(e) =>
                    handleUpdateShareClass(
                      shareClass.id,
                      "participationCapMultiple",
                      e.target.value ? Number.parseFloat(e.target.value) : undefined,
                    )
                  }
                  disabled={isPreferenceDisabled(shareClass.liquidationPreference)}
                  placeholder="Optional"
                />
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveShareClass(shareClass.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="new-name">Share Class</Label>
              <Input
                id="new-name"
                value={newShareClass.name}
                onChange={(e) => setNewShareClass({ ...newShareClass, name: e.target.value })}
                placeholder="e.g. Series A Preferred"
              />
            </div>
            <div>
              <Label htmlFor="new-preference">Liquidation Preference</Label>
              <Select
                value={newShareClass.liquidationPreference}
                onValueChange={(value) =>
                  setNewShareClass({
                    ...newShareClass,
                    liquidationPreference: value as LiquidationPreferenceType,
                  })
                }
              >
                <SelectTrigger id="new-preference">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Non-participating">Non-participating</SelectItem>
                  <SelectItem value="Participating">Participating</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="new-shares">Shares Outstanding</Label>
              <Input
                id="new-shares"
                type="number"
                value={newShareClass.sharesOutstanding || ""}
                onChange={(e) =>
                  setNewShareClass({
                    ...newShareClass,
                    sharesOutstanding: Number.parseInt(e.target.value) || 0,
                  })
                }
                placeholder="e.g. 1000000"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddShareClass} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Share Class
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

