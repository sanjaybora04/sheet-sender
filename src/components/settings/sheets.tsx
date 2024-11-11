import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { atomWithStorage } from 'jotai/utils'
import { atom, useAtom, useSetAtom } from "jotai";
import { Card } from "../ui/card";
import { Trash2Icon } from "lucide-react";

export const sheetsAtom = atomWithStorage<any>('sheets', [])
export const rowsAtom = atom<any>([])
export const headersAtom = atom<string[]>([])

export default function Sheets() {
    const setRows = useSetAtom(rowsAtom)
    const setHeaders = useSetAtom(headersAtom)
    const [sheetId, setSheetId] = useState('')
    const [sheetName, setSheetName] = useState('')

    const [sheets, setSheets] = useAtom(sheetsAtom)

    function addSheet() {
        if (sheetId.length < 1) return toast.error('SheetId is required')
        if (sheetName.length < 1) return toast.error('SheetName is required')
        setSheets((prev: any) => [...prev, { sheetId, sheetName }])
        setSheetId('')
        setSheetName('')
    }

    async function loadSheetData(i:string,n:string) {
        const id = toast.loading('Fetching data...')
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${i}/values/${n}!A1:Z?key=${import.meta.env.VITE_API_KEY}`);
        const data = await response.json();
        if(response.status==200){
          toast.dismiss(id)
        }else{
          toast.error('Unable to fetch data',{id})
        }
        setHeaders(data.values[0])
        setRows(data.values.filter((_:any, index:any) => index >= 3 && (index - 3) % 2 === 0).map((v: any) => {
          return data.values[0].reduce((obj: any, header: any, i: number) => {
            obj[header] = v[i];
            return obj;
          }, {});
        }));
      }
    return (
        <div>
            <Input
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
                className='my-1' placeholder="SheetId" />
            <Input
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                className='my-1' placeholder="SheetName" />
            <Button onClick={() => addSheet()}
                className="my-1">Add
            </Button>
            <hr className="my-1" />
            {sheets?.map((s: any) => (
                <Card className="p-2 flex justify-between my-2">
                    <div>
                        <div className=" overflow-hidden max-w-80 text-ellipsis whitespace-nowrap"><b className="font-bold">SheetId: </b>{s.sheetId}</div>
                        <div><b className="font-bold">SheetName: </b>{s.sheetName}</div>
                    </div>
                    <div className="flex gap-2">
                    <Button onClick={()=>loadSheetData(s.sheetId,s.sheetName)}>Load</Button>
                    <Button variant='destructive' className="p-2" onClick={()=>{
                        setSheets((prev:any)=>prev.filter((p:any)=>p!=s))
                    }}><Trash2Icon/></Button>
                    </div>
                </Card>
            ))}
        </div>
    )
}