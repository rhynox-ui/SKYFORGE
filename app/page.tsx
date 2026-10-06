"use client";

import dynamic from "next/dynamic";

const SkyforgeGame = dynamic(() => import("../components/SkyforgeGame"), { ssr: false });

export default function Home() {
  return <SkyforgeGame />;
}
