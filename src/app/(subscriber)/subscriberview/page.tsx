'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CalendarIcon, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, PlusIcon, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import { cn} from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import {  useSearchParams } from 'next/navigation';
import { Group } from 'next/dist/shared/lib/router/utils/route-regex';
import{ useRouter} from 'next/navigation'
import {AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import Navbar from '@/components/ui/navbar';




interface Subscriber {
  email: string;
  id: string;
  name: string;
  subscribers: string;
  createdAt: string;
}

export default function SubscriberListPage() {
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
  const [segment, setSegment] = useState('New Segemnts');
  const [groups, setGroups] = useState<Group[]>([]);
  const [filterText, setFilterText] = useState('');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setselectedRows] = useState<number[]>([]);

  const filteredSubscribers = subscribers.filter(sub =>
    sub.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredSubscribers.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedGroups = filteredSubscribers.slice(startIndex, startIndex + rowsPerPage);
  
  
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get('groupId')
  useEffect(() => {
    if (!groupId) return;
    
    const fetchSubscribers = async () => {
      try{
        const res = await fetch(`http://localhost:4000/subscriber/${groupId}`,{
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}` // adjust as needed
            }
        });
        if(res.ok){
          const data = await res.json();
          setSubscribers(data);
          setTotalSubscribers(data.length);

          if(data.length === 0)
            if (typeof window !== 'undefined'){ //ensure client side only
              router.push(`subscriberlist/add-subscriber?groupId=${groupId}`)
          }
        } else {
          toast.error(`failed to fetch: ${String(res.status)}`);
          
          
        }
      } catch(err) {
        toast.error(`Error fetching subscribers: ${String(err)}`);

      }
    };

    
      fetchSubscribers();
    

  }, [groupId, router]);

  const paginatedSubscribers = subscribers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  


  const [subToDelete, setSubToDelete] = useState<string | null >(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMenuId, setShowMenuId] = useState<string | null>(null);
  const handleDeleteSubscriber = async (subId: string) => {
     
    setSubToDelete(subId)
    setShowDeleteDialog(true);

  };
  const handleConfirmDelete = async (subId: string) => {

    try{
      const res = await fetch(`http://localhost:4000/subscriber/${subId}`, {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}` // adjust as needed
            },
         method: "DELETE",
      });

      if (!res.ok) throw new Error('failed to delete subscriber');
       else{
      toast.success("Subscriber deleted successfully", {
        icon: <Check className="text-white bg-[#27AE60]" />,
        className: "bg-white shadow-md",
      });
      const data=await res.json()
      const subId=data.subId;
      setShowDeleteDialog(false);
      
      setSubscribers(prev => prev.filter(s => s.id !== subId));
      setTotalSubscribers(prev => prev-1);
    } }catch (err) {;
      toast.error(`Error deleting subscriber:${String(err)}`);
  
      
    }
  }
   
  return (
    <div className="min-h-screen flex overflow-x-hidden gap-[30px]">
           <div className="">
              <Navbar></Navbar>
            </div>
      <div className='flex flex-col min-h-screen w-[95vw] text-black gap-[5px] ml-[75px]'>   
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Welcome Series - New Users</h2>
          <p className="text-muted-foreground mb-8">
            he "Welcome Series - New Users" campaign delivers automated introductory emails
          </p>
        </div>
        <div>
          <Button onClick={()=>{router.push(`/subscriberlist/add-subscriber?groupId=${groupId}`)}}>
            <Users className="mr-2 h-4 w-4" /> Add New Subscriber
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-medium text-gray-800">Group Details</h3>
              <p className="text-sm text-gray-600 mt-1">All members of the marketing department</p>
              <p className="text-xs text-gray-400 mt-1">Created on 1/15/2025</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                 <Users className="mr-2 h-4 w-4"/>Total Subscribers
                 <span className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white text-xs font-semibold">
                   {totalSubscribers}
                 </span>
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <CardContent className="p-4 flex justify-between items-center">
          <Input
            placeholder="Search"
            className="w-64"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />

          <div className="flex gap-2">
           {/* Calendar Popover */}
             <Popover>
               <PopoverTrigger asChild>
                 <Button
                     variant="outline"
                     className={cn(
                     'w-[260px] justify-start text-left font-normal',
                      !dateRange && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                     dateRange.to ? (
                    <>
                      {format(dateRange.from, 'dd MMM yyyy')} -{' '}
                      {format(dateRange.to, 'dd MMM yyyy')}
                    </>
                ) : (
                   format(dateRange.from, 'dd MMM yyyy')
                )
              ) : (
                <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
         <Calendar
           initialFocus
           mode="range"
           defaultMonth={dateRange?.from}
           selected={dateRange}
           onSelect={(range) => setDateRange(range as any)}
           numberOfMonths={2}
         />
        </PopoverContent>
      </Popover>

      {/* Segment Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="border border-gray-300 bg-white w-72 h-9 px-4 text-left rounded-md flex items-center justify-between">
                <span>All Segments</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setSegment('Highly Engaged')}>Highly Engaged</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSegment('Moderately Engaged')}>Moderately Engaged</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSegment('Low Engagement')}>Low Engagement</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    </CardContent>


        {/* Table */}
        <Card className='p-6'>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow >
                  <TableHead><input type="checkbox" /></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Email ID
                      <span className="text-base ml-1 flex gap-0">
                        <span className="cursor-pointer hover:text-black">↑</span>
                        <span className="cursor-pointer hover:text-black">↓</span>
                      </span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Added Date
                      <span className="text-base ml-1 flex gap-0">
                        <span className="cursor-pointer hover:text-black">↑</span>
                        <span className="cursor-pointer hover:text-black">↓</span>
                      </span>
                    </div>
                </TableHead>
                 <TableHead>
                    <div className="flex items-center gap-1">
                      Actions
                      <span className="text-base ml-1 flex gap-0">
                        
                      </span>
                    </div>
                </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSubscribers.map((s, i) => (
                  <TableRow key={s.id}>
                    <TableCell><input type="checkbox" /></TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{new Date(s.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className=' relative p-3 text-gray-500 text-lg cursor-pointer'>
                      <span 
                       onClick={(e) => {
                          e.stopPropagation();
                          setShowMenuId(s.id)
                        }}
                        className="cursor-pointer"
                      >
                      
                        ⋯
                      </span>
                      {showMenuId === s.id && (
                            <div className="absolute top-4 right-10 flex flex-col justify-between w-[124px] h-[30px] rounded-md shadow-lg bg-white ring-1 ring-gray ring-opacity-5 z-10">
                              {/* <button
                                // onClick={(e) => {
                                //   e.stopPropagation();
                                //   handleEditSubscriber(s.id);
                                //   setShowMenuId(null);
                                // }}
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
                              </button> */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSubscriber(String(s.id));
                                  setShowMenuId(null);
                                }}
                                className="block w-full text-left px-4  hover:bg-gray-300"
                              >
                                delete
                              </button>
                            </div>
                          )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm px-16">
          <div className="text-gray-400">
            {selectedRows.length} of {subscribers.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="mr-2">Rows per page</span>
              <select
                className="border-gray-700 rounded px-2 py-1"
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
        </div>
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Subscriber?</AlertDialogTitle>
            <AlertDialogDescription>
             Are you sure you want to remove this subscriber from the group?<br />
             This actin won't delete the user from your account, only from this group
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
              <Button className="bg-red-500 hover: bg-red-600" onClick={async() => {
                if (subToDelete !== null){
                  await handleConfirmDelete(subToDelete);
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
    </div>
  );
}
