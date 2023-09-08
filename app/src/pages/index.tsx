import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import Head from "next/head";
import { useState } from "react";

export default function HomePage() {
  const [cid, setCID] = useState("");

  return (
    <div
      className={`bg-gradient-to-br from-gray-700 to-gray-950 min-h-screen flex flex-col ${inter.className}`}
    >
      <Head>
        <title>IPFSure</title>
      </Head>

      {/* Header */}
      <header className="py-4 px-4 flex justify-end items-center mb-12 sm:mb-24">
        <button className="bg-gradient-to-br from-gray-700 to-black text-white py-2 px-4 rounded hover:opacity-80 focus:outline-none transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-75">
          Connect Wallet
        </button>
      </header>

      {/* Hero */}
      <div className="text-center px-4 mb-12 sm:mb-24">
        <h1 className="text-3xl sm:text-4xl text-white mb-4">IPFSure 🙆‍♂️</h1>
        <p className="text-lg sm:text-2xl text-gray-300">
          Ensure IPFS data integrity with replication, repair, and renewal
        </p>
      </div>

      <div className="flex-1 px-4 mb-12">
        {/* Centered Form */}
        <div className="flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96 space-y-4 max-w-xl w-full">
            <div>
              <label
                htmlFor="name"
                className="block text-black text-sm font-bold mb-2"
              >
                IPFS CID
              </label>
              <input
                type="text"
                name="cid"
                id="cid"
                placeholder="Qm..."
                value={cid}
                onChange={(e) => setCID(e.target.value)}
                className="shadow appearance-none border rounded w-full p-3 text-black leading-tight focus:outline-none text-xs"
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                disabled={!cid}
                className="bg-gradient-to-br from-gray-700 to-black text-white py-2 px-4 rounded hover:opacity-80 focus:outline-none transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-75"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Footer */}
      <footer className="text-center py-4">
        <p className="text-white text-xs">
          © 2023 IPFSure. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
