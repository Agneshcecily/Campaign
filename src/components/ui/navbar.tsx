import { Users, MessageCircle, Megaphone, LayoutDashboard, LayoutTemplate } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {

const router=useRouter();
const pathName=usePathname();
const [active,setActive]=useState('profile');
const isActive = (route: string) => pathName.startsWith(route);
const isSubscriber = (routes: string[]) => 
  routes.some(route => pathName.startsWith(route));
const campaignRoute = [
  '/campaign-dashboard',
  '/campaign-stepper',
  '/campaign-view',
].some((route) => pathName.startsWith(route));

  return (
    <div className="fixed h-screen w-[75px] bg-black flex flex-col gap-[2px] justify-between items-center py-4 ">
      <div className="flex flex-col gap-4 ">
      <div className='w-[36px] h-[36px] flex items-center justify-center'  >
      <Image
      src={'/image.png'}
      width={20}
      height={20}
      alt='image'>
      </Image>
      </div>
      <div onClick={()=>router.push('/dashboard')}
      className={`w-[36px] h-[36px] flex items-center justify-center ${isActive('/dashboard') ? 'bg-white rounded-md':''}`}>
        <LayoutDashboard className="w-[24px] h-[24px] text-stone-500" />
        </div>  
      <div onClick={()=>router.push('/campaign-dashboard')}
      className={`w-[36px] h-[36px] flex items-center justify-center ${campaignRoute ? 'bg-white rounded-md':''}`}> 
        <Megaphone className="w-[24px] h-[24px] text-stone-500" />
      </div>
      <div onClick={()=>router.push('/subscriberlist')}
      className={`w-[36px] h-[36px] flex items-center justify-center ${isSubscriber(['/subscriberlist', '/subscriberview']) ? 'bg-white rounded-md':''}`}>
        <Users className="w-[24px] h-[24px] text-stone-500" />
      </div>
      <div onClick={()=>router.push('/objective')}
      className={`w-[36px] h-[36px] flex items-center justify-center ${isSubscriber(['/objective','/template']) ? 'bg-white rounded-md':''}`}>
        <LayoutTemplate className="w-[24px] h-[24px] text-stone-500" />
      </div>

      </div>

      {/* Bottom 2 Icons */}
      <div className="flex flex-col gap-4 items-center">
      <div onClick={()=>setActive('bottom1')}
      className={`w-[36px] h-[36px] flex items-center justify-center ${active==='bottom1' ? 'bg-white rounded-md':''}`}>
        <MessageCircle className="w-[24px] h-[24px] text-stone-500" />
      </div>
      <div onClick={()=>setActive('bottom2')}
      className={`w-[36px] h-[36px] flex items-center justify-center ${active==='bottom2' ? 'bg-white rounded-md':''}`}>
        <MessageCircle className="w-[24px] h-[24px] text-stone-500" />
      </div>
      <div onClick={()=>setActive('bottom3')}
      className={`w-[36px] h-[36px] flex items-center justify-center ${active==='bottom3' ? 'bg-white rounded-md':''}`}>
        <MessageCircle className="w-[24px] h-[24px] text-stone-500" />
      </div>
     
      </div>
      </div>
    
  );
}