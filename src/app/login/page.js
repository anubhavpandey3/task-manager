'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/') // Redirect to homepage or dashboard after login
    } catch (err) {
      // Customize error messages for better user experience
      let userFriendlyError = "An unknown error occurred. Please try again."
      if (err.code === "auth/invalid-email") {
        userFriendlyError = "Invalid email address format."
      } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        userFriendlyError = "Invalid email or password."
      } else if (err.code === "auth/too-many-requests") {
        userFriendlyError = "Too many failed login attempts. Please try again later."
      }
      setError(userFriendlyError)
    }
  }

  const handleSignUpRedirect = () => {
    router.push('/signup') // Assuming you have a /signup page
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-blue-400 tracking-wide">TASK MANAGER</h1>
        <p className="text-xl text-gray-300 mt-2">Log In to Your Account</p>
      </div>

      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">Welcome Back!</h2>
        
        {error && (
          <p className="bg-red-800 text-white p-3 rounded-md mb-4 text-center">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-3 mb-4 border border-gray-600 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border border-gray-600 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out font-semibold text-lg shadow-md"
        >
          Log In
        </button>

        <p className="text-center text-gray-400 mt-6">
          Don&apos;t have an account?{' '} {/* Apostrophe escaped here */}
          <button
            type="button"
            onClick={handleSignUpRedirect}
            className="text-blue-400 hover:underline font-medium"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  )
}
