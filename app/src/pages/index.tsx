// import Image from 'next/image'
// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })

// export default function Home() {
//   return (
//     <main
//       className={`${inter.className}`}
//     >
//      Main
//     </main>
//   )
// }

// pages/page.tsx

import Head from "next/head";
import { useState } from "react";

export default function HomePage() {
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Head>
        <title>Expensive Black</title>
      </Head>

      {/* Header */}
      <header className="text-center py-8">
        <h1 className="text-4xl text-white font-serif">Expensive Black</h1>
      </header>

      {/* Centered Form */}
      <main className="flex-grow flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg w-96"
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-black text-sm font-bold mb-2"
            >
              Name:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-black text-sm font-bold mb-2"
            >
              Email:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </main>

      {/* Optional Footer */}
      <footer className="text-center py-4">
        <p className="text-white">
          © 2023 Expensive Black. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
