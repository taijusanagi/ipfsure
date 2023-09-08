import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import Head from "next/head";
import { useState } from "react";

export default function HomePage() {
  const [cid, setCID] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className={`bg-gradient-to-br from-gray-700 to-gray-950 min-h-screen flex flex-col ${inter.className}`}
    >
      <Head>
        <title>IPFSure</title>
      </Head>

      <header className="py-4 px-4 flex justify-end items-center mb-12 sm:mb-24">
        <button className="bg-gradient-to-br from-gray-700 to-black text-white py-2 px-4 rounded hover:opacity-80 focus:outline-none transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-75">
          Connect Wallet
        </button>
      </header>

      <div className="text-center px-4 mb-12 sm:mb-24">
        <h1 className="text-3xl sm:text-4xl text-white mb-4">IPFSure 🙆‍♂️</h1>
        <p className="text-lg sm:text-2xl text-gray-300">
          Ensure IPFS data integrity with replication, repair, and renewal
        </p>
      </div>

      <div className="flex-1 px-4 mb-12">
        <div className="flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96 space-y-4 max-w-xl w-full">
            <div>
              <label
                htmlFor="name"
                className="block text-black text-sm font-bold mb-2"
              >
                Input CID
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
                onClick={() => setIsModalOpen(true)} //
                className="bg-gradient-to-br from-gray-700 to-black text-white py-2 px-4 rounded hover:opacity-80 focus:outline-none transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-75"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-xl w-full relative z-10">
            <h2 className="text-lg font-bold mb-4 text-center">
              Choose Storage Method
            </h2>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-black text-sm font-bold mb-2"
              >
                CID
              </label>
              <p className="text-xs">{cid}</p>
            </div>
            <div className="sm:flex sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 border p-4 rounded shadow-sm bg-gray-50">
                <h3 className="text-md font-semibold mb-2 text-center">
                  NFTStorage
                </h3>
                <p className="text-sm text-center mb-4">
                  Recommended for most users. Easy to setup.
                </p>
                <button
                  disabled={!cid}
                  onClick={() => setIsModalOpen(true)} //
                  className="w-full bg-gradient-to-br from-gray-700 to-black text-white py-2 px-4 rounded hover:opacity-80 focus:outline-none transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-75"
                >
                  Choose
                </button>
              </div>
              <div className="flex-1 border p-4 rounded shadow-sm bg-gray-50">
                <h3 className="text-md font-semibold mb-2 text-center">
                  Custom
                </h3>
                <p className="text-sm text-center mb-4">
                  Advanced options for replication, repair, and renewal.
                </p>
                <button
                  onClick={() => {}}
                  className="w-full bg-gradient-to-br from-gray-700 to-black text-white py-2 px-4 rounded hover:opacity-80 focus:outline-none transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-75"
                >
                  Choose
                </button>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-0 right-0 mx-4 my-2 focus:outline-none text-2xl text-gray-800 transition-opacity hover:opacity-75"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Optional Footer */}
      <footer className="text-center py-4">
        <p className="text-white text-xs">
          © 2023 IPFSure. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
