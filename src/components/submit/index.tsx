import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { ArrowRight } from "lucide-react";
import { Table } from "@tanstack/react-table";
import {atom, useAtomValue} from 'jotai'
import SelectMethod from "./select-method";
import SelectColumn from "./select-column";
import SendWhatsapp from "./send-whatsapp";
import SendEmail from "./send-email";

export const stepAtom = atom(1)
export const methodAtom = atom<any>()
export const columnAtom = atom<any>()

export default function Submit({ table }: { table: Table<any> }){
    let stepComponent
    const step = useAtomValue(stepAtom)

    const method = useAtomValue(methodAtom)
    const column = useAtomValue(columnAtom)

    switch (step){
        case 1:
            stepComponent= <SelectMethod/>
            break;
        case 2:
            stepComponent= <SelectColumn table={table}/>
            break;
        case 3:
            if(method.methodType=='email'){
                stepComponent= <SendEmail recipients={table.getSelectedRowModel().rows.map(row=>row.original[column])}/>
            }else{
                stepComponent= <SendWhatsapp numbers={table.getSelectedRowModel().rows.map(row=>row.original[column])}/>
            }
            break

    }

    return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="p-2"><ArrowRight></ArrowRight></Button>
                </DialogTrigger>
                <DialogContent className="max-w-max"
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    {stepComponent}
                </DialogContent>
            </Dialog>
    )
}