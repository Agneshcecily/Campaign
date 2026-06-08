'use client';

import React, { ChangeEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}
export default function CreateNewPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword,setNewPassword]=useState("");
  const router=useRouter();
     const [password,setPassword]=useState('');
     const [confirmPassword,setConfirmPassword]=useState('');
     const [errors, setErrors] = useState<FormErrors>({})
     const [touched, setTouched] = useState({ email: false, password: false,confirmPassword:false })
     const gmailRegex =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
     const togglePassword = () => setShowPassword((prev) => !prev);
     const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);    
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{}|']/;
    const hasUppercase = /[A-Z]/;
    const hasLowercase=/[a-z]/;
    const hasNumber = /\d/;
  
  
    const validatePassword=(value:string)=>{
        if(!value){
          return "Password is required"
        }
        if(value.length<6){
          return "password must be atleast 6 characters"
        }
        else{
          if(!hasLowercase.test(value)){
            return "Password must contain a lower Case letter"
          }
          if(!hasUppercase.test(value)){
            return "Password must contain atleast one Uppercase"
          }
          else if(!hasNumber.test(value)){
              return "Password must contain atleast one Number"
            }
            else if(!hasSpecialChar.test(value)){
              return "Password must contain atleast one special character"
            }
          
        }
    }
  
    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setPassword(value)
      
      if (touched.password) {
        setErrors(prev => ({
          ...prev,
          password: validatePassword(value)
        }))
      }
    }
     const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setConfirmPassword(value)
      
      if (touched.password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: validatePassword(value)
        }))
      }
    }
  
  
    const handleBlur = (field: 'email' | 'password' | 'confirmPassword') => {
      setTouched(prev => ({ ...prev, [field]: true }))
      
      if (field === 'password') {
        setErrors(prev => ({
          ...prev,
          password: validatePassword(password)
        }))
      }
      else if(field === 'confirmPassword'){
        setErrors(prev =>({
          ...prev,
          confirmPassword:validatePassword(confirmPassword)
        }))
      }
    }
   
  const backToLogin=()=>{
  router.push('/login')
  }

  const handleSubmit=async (e:React.FormEvent)=>{
  e.preventDefault();
  const passwordError=validatePassword(password);
  const confirmPasswordError=validatePassword(confirmPassword);
   

    setTouched({ email: true, password: true ,confirmPassword:true})

    if(passwordError || confirmPasswordError){
      
      return
    }

    if(password!==confirmPassword){
        setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match"
      }))
         return;
    }
  try{
          const response = await fetch('http://localhost:4000/auth/changepassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials:'include',
          body: JSON.stringify({newPassword:password}),
        });
        const res= await response.json()
        if(response.status===401){
          return false;
        }
        if(response.ok){
          router.push('/login')
        }
  }
  catch(error){
     return false;
  }
  
      } 

  

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-1/2 bg-black p-6">
        <div className="flex items-center space-x-2 text-white">
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <Card className="w-full max-w-md border-none shadow-none">
          <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1 items-center text-center">
            <CardTitle className="text-2xl font-bold">Create a New Password</CardTitle>
            <CardDescription className="text-center">
              Make sure it is strong and unique to keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="new-password" className="text-sm font-medium">
                  New Password
                </label>
                <div className="relative">
                  <Input 
                    id="new-password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter new password" 
                    onChange={handlePasswordChange}
                    onBlur={()=>handleBlur('password')}
                    className={errors.password && touched.password ? "border-red-500 focus:ring-0 focus-visible:ring-0 padding-[10px] " :"w-full pr-10"}
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && touched.password && (<p className="text-red-500 text-sm mb-1">{errors.password}</p>)}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input 
                    id="confirm-password" 
                    onBlur={()=>handleBlur('confirmPassword')}
                    onChange={handleConfirmPasswordChange}
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Re-enter password" 
                    className={errors.confirmPassword && touched.confirmPassword ? "border-red-500 focus:ring-0 focus-visible:ring-0 padding-[10px] " :"w-full pr-10"}
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && (<p className="text-red-500 text-sm mb-1">{errors.confirmPassword}</p>)}
              </div>
            </div>
            
            <Button 
            type='submit'
            className="w-full bg-black hover:bg-gray-800 text-white">
              Reset Password
            </Button>
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