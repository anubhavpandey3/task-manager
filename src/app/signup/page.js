'use client'

import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push('/login') // redirect after successful signup
    } catch (err) {
      // Customize error messages for better user experience
      let userFriendlyError = "An unknown error occurred. Please try again."
      if (err.code === "auth/email-already-in-use") {
        userFriendlyError = "This email address is already in use."
      } else if (err.code === "auth/invalid-email") {
        userFriendlyError = "Invalid email address format."
      } else if (err.code === "auth/weak-password") {
        userFriendlyError = "Password should be at least 6 characters."
      } else if (err.code === "auth/operation-not-allowed") {
        userFriendlyError = "Email/password accounts are not enabled. Please contact support."
      }
      setError(userFriendlyError)
    }
  }

  const handleLoginRedirect = () => {
    router.push('/login') // Redirect to the login page
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-blue-400 tracking-wide">TASK MANAGER</h1>
        <p className="text-xl text-gray-300 mt-2">Create Your Account</p>
      </div>

      <form onSubmit={handleSignup} className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">Sign Up</h2>
        
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
          placeholder="Password (min 6 characters)"
          className="w-full p-3 mb-6 border border-gray-600 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-300 ease-in-out font-semibold text-lg shadow-md"
        >
          Sign Up
        </button>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <button
            type="button"
            onClick={handleLoginRedirect}
            className="text-blue-400 hover:underline font-medium"
          >
            Log In
          </button>
        </p>
      </form>
    </div>
  )
}
