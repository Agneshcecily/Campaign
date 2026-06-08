'use client'

import { JSX, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag, Plus, LayoutTemplate, CheckCheck, Ellipsis, ShoppingBagIcon, SendIcon, GiftIcon, RefreshCw, SettingsIcon, SmileIcon, MessageSquareIcon,Sparkles, RocketIcon, ShoppingCart, Users, Megaphone, Repeat } from "lucide-react";
import Navbar from '@/components/ui/navbar';
import { useRouter } from 'next/navigation';
import DropdownMenu from '@/components/ui/edit-delete';
import { toast, Toaster } from 'sonner';

interface Objective {
  name: string;
  description: string;
  id:number;
  icon: JSX.Element;
}

export default function CampaignObjectives() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false); 
  const [objectiveName, setObjectiveName] = useState('');
  const [objectiveDescription, setObjectiveDescription] = useState('');
  const [objId,setObjId]=useState('');
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [editDialogOpen,setEditDialogOpen]=useState(false);
  const [isEditing,setIsEditing]=useState(false);
  const [isDeleteDialogOpen,setIsDeleteDialogOpen]=useState(false)
  const maxLengthObjectiveName = 25;
  const maxLengthObjectiveDescription = 70;
  const [isClicked,setIsClicked]=useState(false)

   const handleEdit=(objective:Objective)=>{
    setObjectiveName(objective.name);
    setObjectiveDescription(objective.description);
    setObjId(String(objective.id));
    setEditDialogOpen(true)
    setOpenDropdownId(null)
    setIsEditing(true);
   }
    const handleClick=()=>{
     if(isClicked) return;
     setIsClicked(true)
      setTimeout(() => {
      setIsClicked(false);
    }, 5000);
  };
const getIconByObjectiveName = (name: string) => {
  const lower = name.toLowerCase();

  if (lower.includes("promote") || lower.includes("promotion")) return <ShoppingBagIcon className='h-[26.67px] '/>;
  if (lower.includes("drive") || lower.includes("traffic")) return <SendIcon className='h-[26.67px]'/>;
  if (lower.includes("offer") || lower.includes("gift")) return <GiftIcon className='h-[26.67px]'/>;
  if (lower.includes("re-engage") || lower.includes("feature")) return <RefreshCw className='h-[26.67px]'/>;
  if (lower.includes("custom") || lower.includes("favorite")) return <SettingsIcon className='h-[26.67px]'/>;
  if (lower.includes("welcome")) return <SmileIcon className='h-[26.67px]'/>;
  if (lower.includes("feedback")) return <MessageSquareIcon className='h-[26.67px]'/>;
  if (lower.includes("launch")) return <RocketIcon className='h-[26.67px]'/>;
  if (lower.includes("sales")) return < ShoppingCart className='h-[26.67px]'/>;
  if (lower.includes("referal")|| lower.includes("invite")) return <Users className='h-[26.67px]'/>;
  if (lower.includes("campaign")) return <Megaphone className='h-[26.67px]'/>;
  if (lower.includes("subscription") || lower.includes("renew")) return <Repeat className='h-[26.67px]'/>; //bell,creditcard

  return <Sparkles className='h-[26.67px]'/>;
};

    const handleDelete=(objective:Objective)=>{
    setObjId(String(objective.id));
    setIsDeleteDialogOpen(true)
    setOpenDropdownId(null)
   }

    useEffect(() => {
    const fetchObjectives = async () => {
      try {
        const res = await fetch('http://localhost:4000/campaign-details/objective-details', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}` // adjust as needed
          }
        });
        if (!res.ok) {
  const text = await res.text(); // Use .text() instead of .json() for error responses
  return;
}
        const data = await res.json();
        if (res.ok) {
          
            setObjectives(data);
        } else {
          return data.message
        }
      } catch (err) {
        return err
      } 
    };

    fetchObjectives();
  }, []);
  const handleAddObjective = (newId:number) => {
    if (objectiveName.trim() && objectiveDescription.trim()) {
      const newObjective: Objective = {
        name: objectiveName,
        description: objectiveDescription,
        id:newId,
        icon: <ShoppingBag size={24} />,
        
      };
      setObjectives(prev => prev
        ? isEditing
          ? prev.map(obj => obj.id === newId ? newObjective : obj) // update existing
          : [...prev, newObjective] // add new
        : [newObjective]
      );
      setIsDialogOpen(false);
      setIsSuccessDialogOpen(!isEditing);
      setObjectiveName('');
      setObjectiveDescription('');
      setObjId(String(newId));
      setIsEditing(false);
      setEditDialogOpen(false);
    }
  };

  const handleSubmit=async (e:React.FormEvent)=>{
  e.preventDefault();

  try{
          const token=localStorage.getItem('authToken')
          const response = await fetch('http://localhost:4000/campaign-details/objective', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({name:objectiveName,description:objectiveDescription}),
        });
        const res=await response.json()
        if(response.ok){
          const newObjId=res.objId;
          setObjId(newObjId);
          handleAddObjective(newObjId);
        }
        if(response.status===401){
          return false;
        }
      }
      catch(error){
           return false;    }
    }
  const handleEditSubmit=async (e:React.FormEvent)=>{
      e.preventDefault();
 
  try{
          const token=localStorage.getItem('authToken')
          const response = await fetch(`http://localhost:4000/campaign-details/objective/${objId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({name:objectiveName,description:objectiveDescription}),
        });
        const res=await response.json()
        if(response.ok){
          const newObjId=res.objId;
          setObjId(newObjId);
          handleAddObjective(newObjId);
        }
        if(response.status===401){
          return false;
        }
      }
      catch(error){
           return false;    }
    }
  const handleDeleteSubmit=async (e:React.FormEvent)=>{
      e.preventDefault();

  try{
          const token=localStorage.getItem('authToken')
          const response = await fetch(`http://localhost:4000/campaign-details/objective-delete/${objId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const res=await response.json()
        if(response.ok){
         const newObjId=res.objId

         setIsDeleteDialogOpen(false);
         setObjectives(prev => prev.filter(obj => obj.id !== newObjId)); 
        }
        if(response.status===401){
          return false;
        }
      }
      catch(error){
           return false;    }
    }
   

  const handleLater = () => {
    setIsSuccessDialogOpen(false);
     toast.success("Objective added successfully!", {
        icon: <CheckCheck className="text-green-600" />,
        className: "bg-white shadow-md",
    }); 
  };

  const router=useRouter()

  return (
    <div className="flex min-h-screen w-full bg-white overflow-x-hidden">
      <div><Navbar/></div>
      <div className='flex flex-col min-h-screen flex-1 ml-[75px] px-4 pl-12'>
        <header className="flex items-center justify-between p-4 bg-white">
          <div className="flex items-center">
            <div>
              <h1 className="text-xl font-bold">All Objectives</h1>
              <p className="text-sm text-gray-500">Select a Template That Matches Your Campaign Goal</p>
            </div>
          </div>
          <Button className="bg-black text-white hover:text-black hover:bg-[#E0E0E0]" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Objective
          </Button>
        </header>

        <main className="flex-1 p-4">
          {(!objectives || objectives.length === 0) ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded mb-4">
                <LayoutTemplate strokeWidth={2} className='text-stone-500 w-[48px] h-[48px]' />
              </div>
              <p className="text-gray-600 max-w-md mb-2">
                You haven't added any Objectives yet. Start building your Objective by selecting "Add New Objective"
              </p>
              <Button variant="outline" className="mt-4 hover:bg-[#E0E0E0]" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Objective
              </Button>
            </div>
          ) : (
            <div className="space-y-6 border p-4 ">
              <h2 className="text-xl font-semibold">Your Campaign Objectives</h2>
                 <Toaster position="top-center" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full pl-16 pr-6">
                {objectives.map((objective, index) => (
                  <Card key={index} className="relative w-full max-w-[360px] h-[240px] border-2 border-black  bg-white rounded-xl shadow-md flex flex-col justify-center pt-4">
                    <CardHeader className="flex flex-col items-center text-center">
                      <Button variant="ghost" size="icon" className="absolute right-2 top-2 text-zinc-950"  onClick={() => setOpenDropdownId(
                                       openDropdownId === index ? null : index
                        )}>
                        <Ellipsis size={16} className='w-6 h-6 rotate-90'/>
                      </Button>
                       <div className='absolute top-4 right-4'>
                       <DropdownMenu
                        isOpen={openDropdownId === index}
                        onClose={() => setOpenDropdownId(null)}
                        onEdit={()=>{handleEdit(objective)}}
                        onDelete={() => {
                          handleDelete(objective);
                        }}
                        position="right"
                      />
                      </div>
                      <div className="h-8 w-8 flex items-center justify-center">
                       { getIconByObjectiveName(objective.name)}
                      </div>
                      <CardTitle className='font-semibold text-[24px] leading-[32px] tracking-[-0.025em] text-center font-inter'>{objective.name}</CardTitle>
                      <CardDescription className="font-inter font-normal text-sm leading-5 tracking-normal text-center">
                        {objective.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button onClick={()=>{
                        router.push(`/template?objId=${objective.id}`);
                      }} 
                      className="w-full bg-black text-white hover:text-black hover:bg-[#E0E0E0]">View Objective</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="w-[512px] h-[284px]">
            <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add New Objective</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">           
              <div className="space-y-2">
                <Label htmlFor="objective-name" className="after:content-['*'] after:text-red-500 after:ml-0.5">
                  Objective Name
                </Label>
                <div className='relative'>
                <Input
                required
                  id="objective-name"
                  maxLength={25}
                  value={objectiveName}
                  onChange={(e) => setObjectiveName(e.target.value.slice(0, maxLengthObjectiveName))}
                  placeholder="Enter objective name"
                />
                <span className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none'>{objectiveName.length}/{maxLengthObjectiveName}</span>
              </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                 <div className='relative'>
                <Input
                  required
                  id="description"
                  maxLength={70}
                  value={objectiveDescription}
                  onChange={(e) => setObjectiveDescription(e.target.value.slice(0, maxLengthObjectiveDescription))}
                  placeholder="Enter description"
                />
                <span className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none'>{objectiveDescription.length}/{maxLengthObjectiveDescription}</span>
              </div>
              </div>
            </div>
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </DialogClose>
              <Button className="bg-black text-white"  type='submit' >
                Create Objective
              </Button>
            </DialogFooter>
              </form>
          </DialogContent>
        </Dialog>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="w-[512px] h-[284px]">
            <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Objective ?</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">           
              <div className="space-y-2">
                <Label htmlFor="objective-name" className="after:content-['*'] after:text-red-500 after:ml-0.5">
                  Objective Name
                </Label>
                <Input
                required
                  id="objective-name"
                  value={objectiveName}
                  onChange={(e) => setObjectiveName(e.target.value)}
                  placeholder="Enter objective name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  required
                  id="description"
                  value={objectiveDescription}
                  onChange={(e) => setObjectiveDescription(e.target.value)}
                  placeholder="Enter description"
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </DialogClose>
              <Button className="bg-black text-white"  type='submit' onClick={handleClick} >
                Edit
              </Button>
            </DialogFooter>
              </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="w-full max-w-sm sm:max-w-lg p-4 sm:p-6 rounded-md">
            <form onSubmit={handleDeleteSubmit}>
            <DialogHeader>
              <DialogTitle>Delete Objective ?</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 p-2 m-4 ml-0 mr-0 bg-[#EFF6FF] text-[#1E40AF]">           
              <div className="space-y-2">
                <p>Deleting this objective will permanently remove all other Assosciated Information</p>
              </div>
              <div className="space-y-2">
                <p>This action cant be undone</p>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end mt-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-full sm:w-[72px] px-4 py-2 sm:h-[36px]"
                type="button"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              className="w-full sm:w-[142px] px-4 py-2 sm:h-[36px] bg-[#EB5757] text-black hover:bg-[#EB5757] text-sm sm:text-base"
              type="submit"
            >
              Delete
            </Button>
          </DialogFooter>

              </form>
          </DialogContent>
        </Dialog>

        
        <div className='flex justify-center items-center gap-[41px]'>
        <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
          <DialogContent className="w-[512px] h-[273px] p-[24px] text-center">
            <div className='flex flex-col h-[148px] items-center'>
            <div>
            <DialogHeader className='flex items-center justify-center' >
                <div>
                 <CheckCheck></CheckCheck>
                 </div>
                 <div>
              <DialogTitle className="text-black-600">Your Objective Created Successfully</DialogTitle>
              </div>
            </DialogHeader>
            </div>
           
            <div className='flex flex-col items-center'>
            <p className="text-gray-600 py-2">You have created A Objective, But without any Templates. Start Adding Templates to your Objective </p>
            </div>
            <div className='flex w-[48px] h-[48px] border-[2px] justify-center items-center'>
            <LayoutTemplate className='w-[30px] h-[30px] '></LayoutTemplate>
            </div>
             </div>
            <div className="flex flex-col justify-center  items-center h-[36px] ">
            <DialogFooter >
              <div>
              <Button className='w-[232px] h-[36px] p-0' variant="outline" onClick={handleLater}>Later</Button>
              </div>
              <div>
              <Button className="bg-black text-white w-[232px] h-[36px] p-0" onClick={() => router.push(`/template?objId=${objId}`)}>
                Add Template
              </Button>
              </div>
            </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </div>
  );
}
