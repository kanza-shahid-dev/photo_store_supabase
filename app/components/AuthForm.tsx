"use client";

import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function AuthForm() {
  const [isNewUser, setIsNewUser] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(event: React.FormEvent) {
    event.preventDefault();
    // Signup logic here
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error) {
      setIsNewUser(false);
    }
  }

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    // Login logic here
  }

  return (
    <form onSubmit={isNewUser ? handleSignup : handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className=""
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className=""
      />
      <button type="submit">{isNewUser ? "Sign Up" : "Log In"}</button>
      <p>
        {isNewUser ? "Already have an account?" : "New user?"}
        <button onClick={() => setIsNewUser(!isNewUser)}>
          {isNewUser ? "Log In" : "Sign Up"}
        </button>
      </p>
    </form>
  );
}
