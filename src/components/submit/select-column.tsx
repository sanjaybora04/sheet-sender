import { useAtom, useSetAtom } from "jotai"
import { DialogHeader, DialogTitle } from "../ui/dialog"
import { columnAtom, stepAtom } from "."
import { Table } from "@tanstack/react-table"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "../ui/button"

export default function SelectColumn({ table }: { table: Table<any> }) {
    const setStep = useSetAtom(stepAtom)
    const [column,setColumn] = useAtom(columnAtom)
    return (
        <>
            <DialogHeader>
                <DialogTitle>
                    Select Column
                </DialogTitle>
            </DialogHeader>
            <Select
            value={column} 
            onValueChange={(val)=>{
                setColumn(val)
                setStep(3)
            }}>
                <SelectTrigger>
                    <SelectValue placeholder='Select Column' />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {table.getAllColumns().map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.id}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <div className="flex justify-between">
                <Button className="p-2" onClick={()=>setStep(1)}><ArrowLeft/></Button>
                <Button className="p-2" onClick={()=>setStep(3)} disabled={column?false:true}><ArrowRight/></Button>
            </div>
        </>
    )
}