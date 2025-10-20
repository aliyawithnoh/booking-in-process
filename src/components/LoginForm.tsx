import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  message?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, message }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-600 text-white p-6 rounded-t-lg">
            <h1 className="text-2xl font-bold">BCHS Booking</h1>
          </div>
        </div>
        
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Login</CardTitle>
            {message && (
              <p className="text-sm text-muted-foreground mt-2">{message}</p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Continue
              </Button>
              
              <div className="text-center">
                <button 
                  type="button" 
                  className="text-blue-600 hover:underline text-sm"
                  onClick={() => alert('Sign up functionality would be implemented here')}
                >
                  Don't have account? Sign up
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};