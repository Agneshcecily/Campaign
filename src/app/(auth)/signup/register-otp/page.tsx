'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Check } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OtpVerificationPage() {

const router=useRouter();
const [timer, setTimer] = useState(60); // start from 60 seconds
const [isDisabled, setIsDisabled] = useState(true);
const [timerKey, setTimerKey] = useState(0);
const [showNotification, setShowNotification] = useState(false);
const searchParams=useSearchParams()

 const route=searchParams.get("route")

const startTimer = () => {
  setTimer(60);
  setIsDisabled(true);
  setTimerKey(prev => prev + 1);
  setShowNotification(true);
              setTimeout(() => {
                setShowNotification(false);
              }, 3000);
};


useEffect(() => {
  let interval: NodeJS.Timeout;

  if (isDisabled && timer > 0) {
    interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return () => clearInterval(interval);
}, [isDisabled, timerKey]);




const backToLogin=()=>{
  router.push('/login');
}
const otpLength = 6;
  const [otp, setOtp] = useState(Array(otpLength).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

const handleSubmit=async (e:React.FormEvent)=>{
e.preventDefault();
try{
        const response = await fetch('http://localhost:4000/user/register-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
         credentials:'include',
        body: JSON.stringify({otp: Number(otp.join(''))}),
      });
    
      if(response.ok){
        const data=await response.json()
        const token=data.token
        localStorage.setItem('userId',data.userId)
        localStorage.setItem('authToken', token);
        if(route=="login"){
        router.push('/login')
        }
        else{
          router.push('/signup/onetime-details')
        }
      }
      if(response.status===401){
        return false;
      }
    }
    catch(error){
         return false;    }
  }
  const resendOtp=async (e:React.FormEvent)=>{
    e.preventDefault();
    if(isDisabled) return;
    startTimer()
    try{
    const response = await fetch('http://localhost:4000/user/register-resendotp', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials:'include',
            });
            const res= await response.json()
            if(response.status===401){
              setIsDisabled(false);
              return false;
            }
            if(response.ok){
            // Use helper function
             
            } else {
              setIsDisabled(false); // Re-enable on error
              return false;
    }
      }
      catch(error){
        setIsDisabled(false);
        return false;
      }
    }

  useEffect(() => {
  const status = searchParams.get("status");
  if (status === "sent" || route==="login") {
    setShowNotification(true);
        startTimer()

    const timeout = setTimeout(() => {
      setShowNotification(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }
}, [searchParams]);
    

  return (
   <div className="flex min-h-screen bg-white justify-center">
    {showNotification && <div className="fixed top-5  w-[388px] h-[54px]  z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-white rounded-md shadow-lg p-1 border flex items-center gap-3">
        <div className="h-6 w-6 flex items-center justify-center rounded bg-green-500 text-white flex-shrink-0">
          <Check className="h-4 w-4" />
        </div>
        
        <div className="flex-1 gap-[4px]">
          <h4 className="font-medium text-gray-900">Check your inbox!</h4>
          <p className="text-gray-600 text-sm mt-1">An OTP is sent to your mail</p>
        </div>
        </div>
        </div>
       }
      <div className="w-1/2 bg-black p-6"></div>

      <div className="w-1/2 flex items-center justify-center">
        <Card className="w-full max-w-md border-none shadow-none">
          <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1 items-center text-center">
            <CardTitle className="text-2xl font-bold">Verifications OTP</CardTitle>
            <CardDescription>
              Please Enter 6 Digit Code to verify
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center mb-2">
              <p className="text-sm font-medium">Please enter the one-time OTP sent to your Gmail</p>
            </div>

            <div className="flex justify-center gap-2">
              {[...Array(otpLength)].map((_, index) => (
                <Input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg"
                  value={otp[index]}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                 ref={(el) => {
                 if (el) inputRefs.current[index] = el;
                  }}
                />
              ))}
            </div>
              <Button type='submit' className="w-full bg-black hover:bg-gray-800 text-white">
                Continue
              </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Didn’t receive the email? </span>
              <span onClick={resendOtp} className={`text-blue-600 hover:underline cursor-pointer ${
                                isDisabled ? 'pointer-events-none text-gray-400' : ''
                              }`}> 
                              {isDisabled ? `Resend OTP in ${timer}s` : 'Resend OTP'}
              </span>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button onClick={backToLogin} variant="ghost" className="flex items-center text-gray-500">
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