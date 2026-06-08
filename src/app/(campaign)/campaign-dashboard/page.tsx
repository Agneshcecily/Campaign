"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ListFilterIcon,
  MessageCirclePlusIcon,
  MessageSquareDiff,
  MoreHorizontalIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardAction, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/ui/navbar";
import { toast, Toaster } from 'sonner';


export default function CampaignDashboard() {
  type Campaign = {
  id: string;
  campName: string;
  status: string;
  createdAt: string;
  openRate?: string;
  clickRate?: string;
};

  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const navigateToTable = () => router.push("/campaign-stepper");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);

  
const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
const filteredCampaigns = campaigns.filter((campaign) =>
  campaign.campName.toLowerCase().includes(searchTerm.toLowerCase())
);


useEffect(() => {
  const fetchCampaigns = async () => {
    try {
      const res = await fetch("http://localhost:4000/campaign-details",{
         headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}` // adjust as needed
          }
      });
      const data = await res.json();
      setCampaigns(data);
    } catch (error) {
      toast.error(`Failed to fetch campaigns:,${String(error)}`);
    }
  };

  fetchCampaigns();
}, []);
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
const handleDeleteCampaign = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:4000/campaign-details/${id}`, {
       headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}` 
          },
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      toast.error("Failed to delete:", error);
      return;
    }

    setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
    toast.success('Campaign Deleted Successfully');
    
  } catch (error) {
    toast.error(`Network error:, ${String(error)}`);
  }
};






const navigateToView = async(campaignId:string) => {
router.push(`/campaign-view?campaignId=${campaignId}`);

const navigateToView = () => {
router.push('/campaign-view');

};

  if (campaigns.length === 0) {
    return (
      <div className="w-full h-full min-h-screen flex overflow-x-hidden gap-[30px] ">
        <div><Navbar></Navbar></div>
        <div className="flex flex-col min-h-screen w-[95vw] text-black gap-[5px] ml-[75px]">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 md:mb-32 lg:mb-40">
          <div className="max-w-4xl">
            <h1 className={cn("text-2xl md:text-4xl lg:text-5xl font-bold", "text-gray-900")}>
              All Your Campaigns in One Place
            </h1>
            <p className={cn("text-gray-500", "text-base md:text-xl lg:text-2xl", "mt-2")}>
              View, manage, and track every campaign's status and performance.
            </p>
          </div>
          <Button
            onClick={navigateToTable}
            className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-3 md:px-6 md:py-6 text-base md:text-xl rounded-lg flex items-center"
          >
            <MessageCirclePlusIcon className="mr-2 h-5 w-5 md:h-8 md:w-8" />
            Create New Campaign
          </Button>
        </div>

        <div className="w-full flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center py-12 text-center">
            <MessageSquareDiff className="h-24 w-24 text-gray-400 mb-6" />
            <h2 className="text-lg md:text-2xl font-semibold text-gray-500 max-w-md mx-auto">
              You haven't added any Campaigns yet. Start building your Campaigns
            </h2>
            <Button
              variant="link"
              className="text-blue-600 text-base md:text-xl mt-4"
              onClick={navigateToTable}
            >
              <MessageSquareDiff className="mr-2 h-4 w-4" />
              Add New Campaign
            </Button>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div><Navbar></Navbar></div>
      <div className="flex flex-col min-h-screen flex-1 ml-[75px] px-4 pl-12">
      <section className="w-full py-6 px-6">
        <div className="max-w-4xl">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            All Your Campaigns in One Place
          </h1>
          <p className="text-gray-500 text-base md:text-xl lg:text-2xl mt-2">
            View, manage, and track every campaign's status and performance.
          </p>
        </div>
      </section>

      <main className="flex-1 p-4">
        <Card className="w-full rounded-xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col gap-8 w-full">
              <section className="flex flex-col items-start w-full">
                <div className="flex flex-col items-end w-full">
                  <div className="flex items-center justify-between py-4 w-full">
                    <Input className="w-96 h-10 text-zinc-500" placeholder="Filter Campaigns..."   value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <div className="flex items-center gap-2">
                      <Button className="h-10 bg-zinc-900 text-white">
                        <ListFilterIcon className="w-6 h-6 mr-2" />
                        Filter
                      </Button>
                      <Button className="h-10 bg-zinc-900 text-white" onClick={navigateToTable}>
                        <MessageCirclePlusIcon className="w-6 h-6 mr-2" />
                        Create New Campaign
                      </Button>
                    </div>
                  </div>

                  <Table className="border border-zinc-200 rounded-t-md">
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Checkbox
                            checked={selectedRows.length === campaigns.length}
                            onCheckedChange={(checked) =>
                              setSelectedRows(checked ? campaigns.map((c) =>Number(c.id)) : [])
                            }
                          />
                        </TableHead>
                        <TableHead>Campaign Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created Date</TableHead>
                        <TableHead>Open Rate</TableHead>
                        <TableHead>Click Rate</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCampaigns.map((campaign: any) => (
                            <TableRow key={campaign.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedRows.includes(campaign.id)}
                                  onCheckedChange={(checked) =>
                                    setSelectedRows((prev) =>
                                      checked ? [...prev, campaign.id] : prev.filter((id) => id !== campaign.id)
                                    )
                                  }
                              />
                            </TableCell>
                            <TableCell>{campaign.campName}</TableCell>
                            <TableCell>{campaign.status}</TableCell>
                            <TableCell>{formatDate(campaign.createdAt)}</TableCell>
                            <TableCell>{campaign.openRate || "-"}</TableCell>
                            <TableCell>{campaign.clickRate || "-"}</TableCell>
                            <TableCell className="text-center">
                              <DropdownMenu
                               open={dropdownOpenId === campaign.id}
                                  onOpenChange={(isOpen) => {
                                    setDropdownOpenId(isOpen ? campaign.id : null);
                                  }}>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="w-8 h-8 p-0">
                                    <MoreHorizontalIcon className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-32">
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                  <DropdownMenuItem onClick={()=>navigateToView(campaign.id)}>View</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    setDropdownOpenId(null)
                                        setCampaignToDelete(campaign.id);
                                        setDeleteDialogOpen(true);
                                      }}>
                                        Delete
                                      </DropdownMenuItem>

                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}

                    </TableBody>
                    {deleteDialogOpen && (
                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you sure you want to delete this campaign?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. Deleting this campaign will permanently remove all its data.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button
                              variant="default"
                              className="bg-red-600 text-white"
                              onClick={async () => {
                                if (campaignToDelete) {
                                  await handleDeleteCampaign(campaignToDelete);
                                  setDeleteDialogOpen(false);
                                  setCampaignToDelete(null);
                                }
                              }}
                            >
                              Delete Campaign
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}

                  </Table>

                  <footer className="flex items-center justify-between pt-4 w-full">
                    <div className="text-zinc-500">
                      {selectedRows.length} of {campaigns.length} row(s) selected.
                    </div>
                    <div className="flex items-center">
                      <span className="text-zinc-950">Rows per page</span>
                      <Select defaultValue="10">
                        <SelectTrigger className="w-[70px] h-8 ml-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="pl-6">Page 1 of 1</span>
                      <Pagination className="pl-4">
                        <PaginationContent>
                          <PaginationItem>
                            <Button variant="outline" size="icon" className="w-8 h-8 opacity-50">
                              <ChevronsLeftIcon className="w-4 h-4" />
                            </Button>
                          </PaginationItem>
                          <PaginationItem>
                            <Button variant="outline" size="icon" className="w-8 h-8 opacity-50">
                              <ChevronLeftIcon className="w-4 h-4" />
                            </Button>
                          </PaginationItem>
                          <PaginationItem>
                            <Button variant="outline" size="icon" className="w-8 h-8">
                              <ChevronRightIcon className="w-4 h-4" />
                            </Button>
                          </PaginationItem>
                          <PaginationItem>
                            <Button variant="outline" size="icon" className="w-8 h-8">
                              <ChevronsRightIcon className="w-4 h-4" />
                            </Button>
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </footer>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </main>
      </div>
    </div>
  );
}
