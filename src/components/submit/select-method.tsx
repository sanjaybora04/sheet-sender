import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { methodsAtom } from "../settings/methods"
import { Card } from "../ui/card"
import { ArrowRight, Mail, MessageCircle } from "lucide-react"
import { DialogHeader, DialogTitle } from "../ui/dialog"
import { methodAtom, stepAtom } from "."
import { Button } from "../ui/button"

export default function SelectMethod() {
    const methods = useAtomValue(methodsAtom)
    const [method,setMethod] = useAtom(methodAtom)
    const setStep = useSetAtom(stepAtom)
    return (
        <>
            <DialogHeader>
                <DialogTitle>
                    Select Method
                </DialogTitle>
            </DialogHeader>
            <div>
                {methods.length==0&&
                    <div className="text-center p-3 bg-secondary">
                    <div className="text-gray-500">No Methods found.</div>
                    <div className="text-sm">Please add a methods from (Settings{'=>'}Methods)</div>
                </div>
                }
                {methods.map(m => (
                    <Card className="p-2 flex gap-2 items-center hover:bg-secondary cursor-pointer my-2"
                     onClick={()=>{
                        setMethod(m)
                        setStep(2)
                     }}
                    >
                        {m.methodType == 'email' ? <Mail /> : <MessageCircle />}
                        {m.methodType == "email" ? <div>
                            <div className="overflow-hidden max-w-80 text-ellipsis whitespace-nowrap"><b className="font-bold">Host: </b>{m.host}</div>
                            <div className="overflow-hidden max-w-80 text-ellipsis whitespace-nowrap"><b className="font-bold">Port: </b>{m.port}</div>
                            <div className="overflow-hidden max-w-80 text-ellipsis whitespace-nowrap"><b className="font-bold">Email: </b>{m.email}</div>
                            <div className="overflow-hidden max-w-80 text-ellipsis whitespace-nowrap"><b className="font-bold">Password: </b>{m.password}</div>
                        </div> :
                            <div>
                                <div className="overflow-hidden max-w-80 text-ellipsis whitespace-nowrap"><b className="font-bold">Token: </b>{m.token}</div>
                                <div className="overflow-hidden max-w-80 text-ellipsis whitespace-nowrap"><b className="font-bold">NumberId: </b>{m.numberId}</div>
                            </div>
                        }
                    </Card>
                ))}
            </div>
            <div className="flex justify-end">
                <Button className="p-2" onClick={()=>setStep(2)} disabled={method?false:true}><ArrowRight/></Button>
            </div>
        </>
    )
}