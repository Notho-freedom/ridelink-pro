import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 pt-16 pb-16 md:pb-0">{children}</main>
    <div className="hidden md:block">
      <Footer />
    </div>
    <BottomNav />
  </div>
);

export default Layout;
