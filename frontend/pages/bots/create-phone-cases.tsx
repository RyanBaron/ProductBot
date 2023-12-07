// pages/bots/phone-case-bot.tsx
import Head from "next/head";
import Navigation from '../../components/Navigation';
import BackendPreConnect from "../../components/BackendPreConnect";
import DataBasePreConnect from "../../components/DataBasePreConnect";
import { useWallet } from "@meshsdk/react";

export default function CreatePhoneCase() {

  return (
    <div className="siteWrapper bg-pattern-primary flex flex-col min-h-screen">
      <Head>
        <title>Phone Case AI Bot</title>
        <meta name="description" content="Create and order your own custom phone case with AI." />
      </Head>

      <Navigation />

      <main className="main flex-grow">
        <div className="flex flex-col justify-center items-center h-full flex-grow">
          <div className="container flex-grow">

            <div className="flex flex-wrap bg-gray-400 justify-start items-start h-full">
              <div className="w-full md:w-1/3">
                Phone Case Bot - Left Col
              </div>
              <div className="w-full md:w-2/3">
                Phone Case Bot - Right Column
              </div>
            </div>
          </div>
        </div>
      </main>


      <footer className="footer">
        <div className="flex flex-row bg-gray-900 text-gray-400 justify-center items-center h-full flex-grow text-sm p-1">
          <BackendPreConnect />
          <DataBasePreConnect />
        </div>
      </footer>
    </div>
  );
}
