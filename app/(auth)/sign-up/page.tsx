"use client";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const doCreateUserWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };
  console.log(name);
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await doCreateUserWithEmailAndPassword(email, password);
      setName("");
      setEmail("");
      setPassword("");
      alert("New Account Created");
      return router.push("/sign-in");
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              onChange={(e) => setName(e.target.value)}
              name="name"
              placeholder="Your full name"
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white rounded-md p-2 hover:bg-blue-600 transition-colors"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an Admin account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
