import React from "react";
import TrustBar from "./TrustBar";
import Topbar from "./Topbar";


export default function Header() {
  return (
    <div className="dark:bg-ink-900" style={{position:'fixed',zIndex:100, width:'100%'}}>
      <TrustBar />
      <Topbar />
    </div>
  );
}
