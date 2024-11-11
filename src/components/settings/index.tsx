import { Settings2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import Sheets from "./sheets";
import Methods from "./methods";

export default function Settings() {
    const [tab, setTab] = useState('sheets')
    return (
        <Dialog defaultOpen>
            <DialogTrigger asChild>
                <Button className="p-2">
                    <Settings2 />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>Settings</DialogHeader>
                <div className="flex text-center">
                    <div className="w-1/2">
                        <Button variant='outline' className="w-full rounded-r-none" onClick={() => setTab('sheets')}>Sheets</Button>
                        {tab == 'sheets' && <div
                            className='h-0.5 bg-black w-full'
                        />}
                    </div>
                    <div className="w-1/2">
                        <Button variant='outline' className="w-full rounded-l-none" onClick={() => setTab('methods')}>Methods</Button>
                        {tab == 'methods' && <div
                            className='h-0.5 bg-black w-full'
                        />}
                    </div>
                </div>
                {tab == 'sheets' ? <Sheets /> : <Methods />}
            </DialogContent>
        </Dialog>
    )
}