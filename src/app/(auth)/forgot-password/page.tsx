'use client';

import React, { ChangeEvent, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FormErrors {
  email?: string;
}

export default function PasswordResetPage() {
   const gmailRegex = /^[a-zA-Z0-9._%+-]+@[a-z]+\.[a-z]{2,}$/
   const [email,setEmail]=useState("");
   const router=useRouter();
   const [touched, setTouched] = useState({ email: false, password: false })
   const [errors, setErrors]=useState<FormErrors>({})

   const validateEmail=(value:string)=>{
    
    if(!value){
      return "email is required"
    }
    if(!gmailRegex.test(value)){
      return "please enter the valid Gmail Address"
    }       
  }
   const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setEmail(value)
      
      if (touched.email) {
        setErrors(prev => ({
          ...prev,
          email: validateEmail(value)
        }))
      }
    }

    const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }))
    
    if (field === 'email') {
      setErrors(prev => ({
        ...prev,
        email: validateEmail(email)
      }))
    }
  }

   const handleSubmit=async (e:React.FormEvent)=>{
   e.preventDefault();
   const emailError=validateEmail(email);

    setTouched({ email: true, password: true })

    setErrors({
      email:emailError,
    })

    if(emailError){
      return
    }
   try{
            const response = await fetch('http://localhost:4000/auth/sendotp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials:'include',
            body: JSON.stringify({email}),
          });
          const res= await response.json()
          if(response.status===401){
            return false;
          }
          if(response.ok){
            router.push('/otp?status=sent')
            return true;
          }
          else{
            return false;
          }
    }
    catch(error){
      return false;
    }

        }
   
 
 




  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-1/2 bg-black p-6"></div>
      
      <div className="w-1/2 flex items-center justify-center">
        <Card className="w-full max-w-md border-none shadow-none">
          <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1 items-center text-center">
            <CardTitle className="text-2xl font-bold">Forgot Your Password?</CardTitle>
            <CardDescription className="text-center">
              No worries. Enter your email, and we will send you instructions to 
              reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input 
                  id="email" 
                  value={email}
                  onBlur={()=>handleBlur('email')}
                  onChange={handleEmailChange}
                  placeholder="demo@campaignapp.com" 
                  className={errors.email && touched.email ? "border-red-500 focus:ring-0 focus-visible:ring-0 padding-[10px] " :"w-full"}
                />
                {errors.email && touched.email && (<p className="text-red-500 text-sm mt-1">{errors.email}</p>)}
              </div>
           
              <Button type='submit' className="w-full bg-black hover:bg-gray-800 text-white">
                Send Reset Link
              </Button>
      
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={()=>{router.push('/login')}} variant="ghost" className="flex items-center text-gray-500">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}