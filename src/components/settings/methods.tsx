
import { useState } from "react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { Card } from "../ui/card";
import { Mail, MessageCircle, Trash2Icon } from "lucide-react";

export const methodsAtom = atomWithStorage<any[]>('methods',[])

export default function Methods() {
    const [methodType, setMethodType] = useState('')
    //email
    const [host, setHost] = useState('')
    const [port, setPort] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    //whatsapp
    const [token, setToken] = useState('')
    const [numberId, setNumberId] = useState('')

    const [methods,setMethods] = useAtom(methodsAtom)

    function addMethod(){
        if(!methodType)return toast.error('Method type is required')
        if(methodType=='email'){
            if(!host)return toast.error('Host is required')
            if(!port)return toast.error('Port is required')
            if(!email)return toast.error('Email is required')
            if(!password)return toast.error('Password is required')
        }
        if(methodType=='whatsapp'){
            if(!token)return toast.error('Token is required')
            if(!numberId)return toast.error('NumberId is required')
        }
        setMethods((prev:any)=>([...prev,{methodType,host,port,email,password,token,numberId}]))
    }

    return (
        <div>
            <Select value={methodType} onValueChange={setMethodType}>
                <SelectTrigger>
                    <SelectValue placeholder='Method Type' />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="whatsapp">Whatsapp</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            {methodType == 'email' ?
                <div>
                    <Input value={host} onChange={(e) => setHost(e.target.value)} placeholder="Host" className="my-1" />
                    <Input value={port} onChange={(e) => setPort(e.target.value)} placeholder="Port" className="my-1" />
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="my-1" />
                    <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="my-1" />
                </div>
                :methodType=='whatsapp'? <div>
                    <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Token" className="my-1" />
                    <Input value={numberId} onChange={(e) => setNumberId(e.target.value)} placeholder="NumberId" className="my-1" />
                </div>:null
            }
            <Button className="my-1" onClick={()=>addMethod()}>Add</Button>
            <hr className="my-1"/>
            {methods?.map((m: any) => (
                <Card className="p-2 flex justify-between my-2">
                    <div className="flex gap-2 items-center">
                        {m.methodType=='email'?<Mail/>:<MessageCircle/>}
                        {m.methodType=="email"?<div>
                        <div className="overflow-hidden max-w-80 text-ellipsis whitespace-nowrap"><b className="font-bold">Host: </b>{m.host}</div>
                        <div className="overflow-hidden max-w-80 text-ellipsis whitespace-nowrap"><b className="font-bold">Port: </b>{m.port}</div>
                        <div className="overflow-hidden max-w-80 text-ellipsis whitespace-nowrap"><b className="font-bold">Email: </b>{m.email}</div>
                        <div className="overflow-hidden max-w-80 text-ellipsis whitespace-nowrap"><b className="font-bold">Password: </b>{m.password}</div>
                        </div>:
                        <div>
                            <div className="overflow-hidden max-w-80 text-ellipsis whitespace-nowrap"><b className="font-bold">Token: </b>{m.token}</div>
                            <div className="overflow-hidden max-w-80 text-ellipsis whitespace-nowrap"><b className="font-bold">NumberId: </b>{m.numberId}</div>
                        </div>}
                            </div>
                    <div className="flex gap-2">
                    <Button variant='destructive' className="p-2" onClick={()=>{
                        setMethods((prev:any)=>prev.filter((p:any)=>p!=m))
                    }}><Trash2Icon/></Button>
                    </div>
                </Card>
            ))}
        </div>
    )
}