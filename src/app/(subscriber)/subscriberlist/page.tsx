'use client'

import { useEffect, useState } from "react"
import { Check, CheckCheck, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, List, ListFilter, MessageSquareDiff, MessageSquarePlus, UserPlus, Users } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import {AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,} from "@/components/ui/alert-dialog";
import { LargeNumberLike } from "node:crypto"
import { M_PLUS_1 } from "next/font/google"
import router from "next/router"
import Navbar from "@/components/ui/navbar"
import { useRouter } from "next/navigation";
import { group } from "node:console"
import { toast } from "sonner"

interface Group {
  id: string
  name: string
  subscribers: number
  createdAt: string
  description: string;
  senderEmail: string;
  email: string;
}


export default function AllGroups() {
  const router = useRouter();
  const [groupId,setGroupId]=useState('')
  const [open, setOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [SelectedSegment, setSelectedSegment] = useState('All Segments')
  const [groups, setGroups] = useState<Group[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: ""
  });
  
  const [showMenuId, setShowMenuId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const handleEditGroup = (group: Group) => {
    setFormData({
      name: group.name,
      email: group.email,
      description: group.description
    });
    setEditingGroupId(group.id); //saves the edit
    setIsEditModalOpen(true);
  };

  // update api function
  const updateGroup = async (id: string, updatedData: Partial<Group>) => {
    const res = await fetch(`http://localhost:4000/subscriber/groups/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(updatedData),
    });
    if(!res.ok) {
      throw new Error("Failed to Update Group");
    }
    return res.json();
  }
  //api calling
  const handleSaveChanges = async () => {
  if (editingGroupId == null) return;

  try {
    const updatedGroup = await updateGroup(editingGroupId, formData);

    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === editingGroupId ? { ...group, ...updatedGroup } : group
      )
    );

     toast.success("Changes saved successfully", {
      icon: <CheckCheck className="text-green-600" />,
      className: "bg-white shadow-md",
    });

    setFormData({ name: "", email: "", description: "" });
    setIsEditModalOpen(false);
    setEditingGroupId(null);
  } catch (error) {
    toast.error(`Update failed,${String(error)}`);
  }
};



  const segments = [
    'News Letter',
    'Promotion',
    'Product Updates',
    'Events'
  ];

  const handleCreateGroup = async () => {
    if (!formData.name || !formData.email) {
       toast.error("Group name and sender email are required")
      return
    }
    try {
      const response = await fetch('http://localhost:4000/subscriber/groups',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          senderEmail: formData.email,
        }),
      });

      if(!response.ok) {
        throw new Error("Failed to create group");
      }
      if(response.ok){
        const res=await response.json();
         setGroupId(res.id);
      }

      //fetch updated groups after creation
      await fetchGroups();

      setOpen(false);
      setFormData({ name: "", email: "", description: "" });
      setShowSuccessPopup(true);
      
      
    } catch (error) {
      return error
    }

    
  }
  //fetch groups fron backend
  const fetchGroups = async () => {
    try{
      const res = await fetch('http://localhost:4000/subscriber/groups',{
        headers:{'Authorization': `Bearer ${localStorage.getItem('authToken')}`}
      });
      const data = await res.json();
      setGroups(data);
    } 
    catch (error) {
      return error
    }
  };
  useEffect(() => {
  fetchGroups();
  }, []);

  //Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setselectedRows] = useState<number[]>([]);
  


  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(filterText.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filteredGroups.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedGroups = filteredGroups.slice(startIndex, startIndex + rowsPerPage);

  //sucess popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const isNewUser = groups.length === 0

  //handleDelete
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null >(null);
  const handleDeleteGroup = async (groupId:string) => {
    
    setGroupToDelete(groupId);
    setShowDeleteDialog(true);
  };
  const handleConfirmDelete = async (groupId: string) => {
      
    try{
      const res = await fetch(`http://localhost:4000/subscriber/groups/${groupId}/deactive`, {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}` // adjust as needed
            },
        method: "DELETE",
      });
      if(!res.ok) throw new Error('Failed to delete group');

      toast.success("Group deleted successfully", {
        icon: <Check className="text-white bg-[#27AE60]" />,
        className: "bg-white shadow-md",
      });

      setShowDeleteDialog(false) //hides dialogbox

      await fetchGroups();
    } catch (err) {
      toast.error(`Error deleting group :${String(err)}`);
    }
  }

  
  

  return (
    <div className="flex gap-[32px]">
      <div>
        <Navbar></Navbar>
      </div>
    <div className="w-[1150px]">
      
      <div className="flex flex-col justify-between">
      {/* Header and Intro */}
      <div className="mb-6 ml-14 mt-12">
        <h3 className="text-lg font-medium">All Groups</h3>
        <p className="text-gray-500 text-sm">
          Add subscribers manually or import them to build your audience.
        </p>
      </div>
      {!isNewUser && (
        <div className="absolute top-10 right-6 z-10">
          <Button 
            className="flex items-center gap-2 text-white bg-black font-medium"
            onClick={() => setOpen(true)}
            variant="outline"
          >
           <Users size={18} />
            Add New Group
          </Button>
        </div>
      )}
      </div>


      {isNewUser ? (
        <div className="flex flex-col mt-16 items-center justify-center py-16 text-center">
          <div className="mb-4 bg-gray-100 p-4 rounded-full">
            <MessageSquareDiff size={40} className="text-gray-400" />
          </div>
          <p className="text-gray-500 mb-1">
            You haven't added any subscribers yet. Start building your list by manually
          </p>
          <p className="text-gray-500 mb-6">
            by entering contacts or importing from a file.
          </p>
          <button 
            className="flex items-center gap-2 text-blue-600 font-medium "
            onClick={() => setOpen(true)}
          >
            <Users size={20} />
            Add New Group
          </button>
        </div>
      ) : (
        <><div className="bg-white  w-[1400px] h-[400px]  pt-4 px-16">
            <div className="px-6 py-4">
              <div className="flex  justify-between gap-4 items-center">
                <div>
                  <input
                    type="text"
                    placeholder="Filter Campaigns..."
                    className="border px-3 py-1 rounded w-64"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)} />
                </div>
                {/* <Button className="flex items-end bg-gray-900 px-4 py-2 rounded-lg">
      <Filter size={18} className="mr-2"/>
      Filter
    </Button> */}
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline' className="h-8 w-[153px] justify-between">
                        <ListFilter size={18} />
                        {SelectedSegment}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[150px]">
                      {segments.map((segment) => (
                        <DropdownMenuItem
                          key={segment}
                          onClick={() => {setSelectedSegment(segment);
                             
                          }}
                        >
                          {segment}
                         
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Move Add New Group Button here for existing users */}

            </div>

            <div className="max-h-[300px] w-1000px overflow-y-auto">
            <table className=" rounded-md border min-w-full border-t text-sm ">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className='text-left p-3 w-12'>
                    <input type="checkbox" />
                  </th>
                  <th className="text-left p-3">Group Name</th>
                  <th className="text-left p-3">
                    <div className="flex items-center gap-1">
                      Subscribers
                      <span className="text-base ml-1 flex gap-0">
                        <span className="cursor-pointer hover:text-black">↑</span>
                        <span className="cursor-pointer hover:text-black">↓</span>
                      </span>
                    </div>
                  </th>
                  <th className="text-left p-3">
                     <div className="flex items-center gap-1">
                       Created At
                       <span className="text-base ml-1 flex gap-0">
                        <span className="cursor-pointer hover:text-black">↑</span>
                        <span className="cursor-pointer hover:text-black">↓</span>
                      </span>
                    </div>
                    </th>
                  <th className="text-left p-3">
                    <div className="flex items-center gap-1">
                      Actions
                      <span className="text-base ml-1 flex gap-0">
                        <span className="cursor-pointer hover:text-black">↑</span>
                        <span className="cursor-pointer hover:text-black">↓</span>
                      </span>
                    </div>
                      </th>
                </tr>
              </thead>
              <tbody>
                {paginatedGroups.map(group => (
                  <tr key={group.id} 
                      className="border-t"
                      onClick={() =>  router.push(`/subscriberview?groupId=${group.id}`)}
                    >
                    <td className="p-3">
                      <input type="checkbox" />
                    </td>
                    <td className="p-3">{group.name}</td>
                    <td className="p-3">{group.subscribers} Subscribers</td>
                    <td className="p-3">{group.createdAt}</td>
                    <td className="p-3 text-gray-500 text-lg cursor-pointer"
                         onClick={(e) => {
                          e.stopPropagation();
                          setShowMenuId(group.id)}}
                         >
                          ⋯
                          {showMenuId === group.id && (
                            <div className="absolute flex flex-col justify-between w-[124px] h-[104px] rounded-md shadow-lg bg-white ring-1 ring-gray ring-opacity-5 z-10">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditGroup(group);
                                  setShowMenuId(null);
                                }}
                                className="block w-full text-left px-4  hover:bg-gray-300"
                              >
                                edit
                              </button>
                              <button
                                onClick={() => {
                                  // handleViewGroup(group.id);
                                  // setShowMenuId(null);
                                }}
                                className="block w-full text-left px-4  hover:bg-gray-300"
                              >
                                view
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteGroup(group.id);
                                  setShowMenuId(null);
                                }}
                                className="block w-full text-left px-4  hover:bg-gray-300"
                              >
                                delete
                              </button>
                            </div>
                          )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4 text-sm lg-4 px-16 ">
              <div className="text-gray-400">
                {selectedRows.length} of {filteredGroups.length} row(s) selected.
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="mr-2">Rows per page</span>
                  <select
                    className=" border-gray-700 rounded px-2 py-1"
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <span>Page {currentPage} of {totalPages}</span>
                  <div className="flex ml-2">
                    <button
                      className="p-1 border border-gray-700 rounded-l-lg hover:bg-gray-800 disabled:opacity-50"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronsLeft size={16} />
                    </button>
                    <button
                      className="p-1 border-t border-b border-gray-700 hover:bg-gray-800 disabled:opacity-50"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      className="p-1 border-t border-b border-gray-700 hover:bg-gray-800 disabled:opacity-50"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={16} />
                    </button>
                    <button
                      className="p-1 border border-gray-700 rounded-r-lg hover:bg-gray-800 disabled:opacity-50"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronsRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div></>
       
        
      )}

      <AlertDialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <AlertDialogContent className="w-[512px] h-[273px] text-center">
         <AlertDialogHeader className="flex flex-col items-center justify-center">
           <AlertDialogTitle className="text-black-600 text-center">
            <div className="flex items-center justify-center gap-2">
             <CheckCheck size={18} className="text-green-500" />
             <h2 className="text-black-600 text-center">Your Group Created Successfully</h2>
            </div>
          </AlertDialogTitle>


          <AlertDialogDescription className="text-sm gap-2 text-gray-600 mt-2 text-center flex flex-col justify-center items-center">
            <span>
               You have created a list, but without any subscribers. Start by adding subscribers to your list manually or by uploading a file.
            </span>
            <Users size={40} className="text-black" />
          </AlertDialogDescription>
         </AlertDialogHeader>
         
         <AlertDialogFooter className="gap-4 mt-4">
           <AlertDialogCancel className="border border-gray-300">Cancel</AlertDialogCancel>
           <AlertDialogAction
             onClick={() => {
               setShowSuccessPopup(false);
               router.push(`/subscriberlist/add-subscriber?groupId=${groupId}`); // or navigate wherever you need
             }}
             className="bg-black text-white hover:bg-gray-800"
            >
              Add Subscribers

            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New List</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="group-name" className="mb-2">Group Name<span className="text-red-500 ">*</span></Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Summer Launch 2025"
              />
            </div>
            <div>
              <Label htmlFor="description" className="mb-2">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Summer Launch 2025"
              />
            </div>
            <div>
              <Label htmlFor="sender-email" className="mb-2">Default sender email<span className="text-red-500">*</span></Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@mail.com"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateGroup}>Create List</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="group-name" className="mb-4">Group Name<span className="text-red-500">*</span></Label>
              <Input
                id="name"
                value={formData.name?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({...prev, name: e.target.value}))
                }
                placeholder="Summer Launch 2025"
              />
            </div>
            <div>
              <Label htmlFor="description" className="mb-4">Description</Label>
              <Input
                id="description"
                value={formData.description?? ""}
                onChange={(e) => 
                  setFormData((prev) => ({...prev, description: e.target.value}))
                }
                placeholder="Summer Launch 2025"
              />
            </div>
            <div>
              <Label htmlFor="sender-email" className="mb-4">Default sender email<span className="text-red-500">*</span></Label>
              <Input
                id="email"
                type="email"
                value={formData.email?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value}))
                }
                placeholder="example@mail.com"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button onClick={() => {
                handleSaveChanges();
                setIsEditModalOpen(false);
              }}
              >
                Save changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this group?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all associated subscribers from the group."<br />
              Are you sure you want to cancel this campaign?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
              <Button className="bg-red-500 hover: bg-red-600" onClick={async() => {
                if (groupToDelete !== null){
                  await handleConfirmDelete(groupToDelete);
                  setShowDeleteDialog
                }
                
              }}
              >
                Delete
              </Button>
            </div>
        </AlertDialogContent>
      </AlertDialog>
      
    </div>
    </div>
  )
}
