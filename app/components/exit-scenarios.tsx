"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { ExitScenario } from "../types"
import { PlusCircle, Trash2 } from "lucide-react"

interface ExitScenariosProps {
  exitScenarios: ExitScenario[]
  setExitScenarios: (scenarios: ExitScenario[]) => void
}

export function ExitScenarios({ exitScenarios, setExitScenarios }: ExitScenariosProps) {
  const [newExitValue, setNewExitValue] = useState<number | "">("")

  const handleAddScenario = () => {
    if (newExitValue === "") return

    const newScenario: ExitScenario = {
      id: Date.now().toString(),
      exitValue: Number(newExitValue),
    }

    setExitScenarios([...exitScenarios, newScenario])
    setNewExitValue("")
  }

  const handleRemoveScenario = (id: string) => {
    setExitScenarios(exitScenarios.filter((scenario) => scenario.id !== id))
  }

  const handleUpdateScenario = (id: string, exitValue: number) => {
    setExitScenarios(exitScenarios.map((scenario) => (scenario.id === id ? { ...scenario, exitValue } : scenario)))
  }

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Exit Value</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exitScenarios.map((scenario) => (
            <TableRow key={scenario.id}>
              <TableCell>
                <Input
                  type="number"
                  value={scenario.exitValue}
                  onChange={(e) => handleUpdateScenario(scenario.id, Number.parseInt(e.target.value) || 0)}
                />
              </TableCell>
              <TableCell className="w-[100px]">
                <Button variant="ghost" size="icon" onClick={() => handleRemoveScenario(scenario.id)}>
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
            <div className="col-span-3">
              <Label htmlFor="new-exit-value">Exit Value</Label>
              <Input
                id="new-exit-value"
                type="number"
                value={newExitValue}
                onChange={(e) => setNewExitValue(e.target.value ? Number.parseInt(e.target.value) : "")}
                placeholder="e.g. 10000000"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddScenario} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Scenario
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

