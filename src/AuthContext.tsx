/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, useContext, createContext } from "react";
import { type User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient"

interface Credential {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  signOut(): void;
  signInWithEmail(...args: Credential[]): unknown;
  signUpNewUser(...args: Credential[]): unknown;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  // Sign up
  const signUpNewUser = async (newUser: Credential) => {
    const { data, error } = await supabase.auth.signUp({
      email: newUser.email.toLowerCase(),
      password: newUser.password,
    });

    if (error) {
      console.error("Error signing up: ", error);
      return { success: false, error };
    }

    return { success: true, data };
  };

  //SIGN IN
  const signInWithEmail = async (currentUser: Credential) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: currentUser.email.toLowerCase(),
      password: currentUser.password,
    });
    if (error) {
      console.error("Error signing in: ", error);
      return { success: false, error };
    }
    return { success: true, data };
  };

  // SIGN OUT
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ signOut, signInWithEmail, signUpNewUser, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within the AuthProvider");
  }
  return context;
};