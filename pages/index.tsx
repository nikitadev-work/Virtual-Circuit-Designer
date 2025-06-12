'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from 'bim/components/ui/button';
import { Input } from 'bim/components/ui/input';
import { Checkbox } from 'bim/components/ui/checkbox';
import { Label } from 'bim/components/ui/label';
import { Eye, EyeOff, Github, Mail } from 'lucide-react';


export default function MainPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <motion.div
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="w-full max-w-md"
                >

                <div className='bg-white rounded-2xl shadow-xl p-8 space-y-6'>
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter">Welcome back</h1>
                        <p className="text-muted-foreground">Enter your credentials to access your account</p>
                    </div>
                </div>

                <form className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={"test@mail.ru"}
                            value={email}
                            required
                        />
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
