import Head from "next/head";
import Navigation from '../components/Navigation';
import BackendPreConnect from "../components/BackendPreConnect";
import DataBasePreConnect from "../components/DataBasePreConnect";
import { useWallet } from "@meshsdk/react";
import CreatePhoneCaseConversation from "../components/CreatePhoneCase";

export default function Home() {
  const { connected } = useWallet();

  return (
    <div className="siteWrapper bg-pattern-primary flex flex-col min-h-screen">
      <Head>
        <title>ProductBot</title>
        <meta name="description" content="AI Powered Designs for Custom Phone Cases" />
      </Head>

      <Navigation /> {/* Add the Navigation component at the top */}

      <main className="main flex-grow">
        <div className="flex flex-col justify-center items-center h-full flex-grow">
          <div className="container flex-grow pt-10 pb-6">
            <div className="flex flex-row justify-center">
              <div className="w-full lg:w-4/5 text-center">
                <h3 className="font-bold text-2xl">ProductBot</h3>
                <h1 className="font-bold text-5x">Create custom clothing and accessories using AI</h1>
                <p className="text-xl">
                  Unleash potential with smart AI solutions that simplify tasks, enhance creativity, and empower innovation.
                </p>
              </div>
            </div>
          </div>

          <div className="container flex-grow">
            <div className="flex flex-wrap justify-center items-start h-full">
              <div className="w-full lg:w-4/5">
                <div className="flex flex-col space-y-4 items-center justify-center">
                  {/* Card for Generate A Custom Design With AI */}
                  <div className="w-full lg:w-4/5 xl:w-2/3 bg-white p-4 lg:p-8 xl:p-12 shadow block hover:bg-gray-100 mx-auto text-center">
                    <div className="transition ease-in duration-200">
                      <h2 className="text-lg font-semibold">Generate Custom Design With The Help of AI</h2>
                      <p className="text-gray-600">Select a few design inputs and watch your custom, one of a kind, phone case come to life.</p>
                    </div>
                  </div>

                  {/* Card for Select Your Design */}
                  <div className="w-full lg:w-4/5 xl:w-2/3 bg-white p-4 lg:p-8 xl:p-12 shadow block hover:bg-gray-100 mx-auto text-center">
                    <div className="transition ease-in duration-200">
                      <h2 className="text-lg font-semibold">Select Your Favorite Design</h2>
                      <p className="text-gray-600">Select your favorite design and review the mockup for approval.</p>
                    </div>
                  </div>

                  {/* Card for Pay, Print, & Ship */}
                  <div className="w-full lg:w-4/5 xl:w-2/3 bg-white p-4 lg:p-8 xl:p-12 shadow block hover:bg-gray-100 mx-auto text-center">
                    <div className="transition ease-in duration-200">
                      <h2 className="text-lg font-semibold">Pay, Print, & Ship</h2>
                      <p className="text-gray-600">Go through the checkout process. When the sale is finalized we will print your design and ship it directly to you.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container flex-grow my-4 p-4 text-center">
            <h3 className="text-xl font-semibold">Get Started</h3>
            <CreatePhoneCaseConversation />
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
