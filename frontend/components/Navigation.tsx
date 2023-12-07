import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navigation: React.FC = () => {
  const [isAssetsNavOpen, setisAssetsNavOpen] = useState(false);
  const [isBotNavOpen, setIsBotNavOpen] = useState(false);

  const toggleBotNav = () => {
    setIsBotNavOpen(!isBotNavOpen);
    setisAssetsNavOpen(false);
  };

  const toggleAssetsNav = () => {
    setisAssetsNavOpen(!isAssetsNavOpen);
    setIsBotNavOpen(false);
  };

  return (
    <nav className="primary-nav p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" legacyBehavior>
            <a className="font-bold text-xl">
              <Image src="/images/logo.png" alt="ProductBot Logo" width={150} height={50} />
            </a>
          </Link>

          {/* Dropdown for Bots */}
          <div className="relative">
            <button onClick={toggleBotNav} className="font-semibold py-2 px-4 rounded hover:bg-gray-700 transition duration-150">
              Product Bots
            </button>
            {isBotNavOpen && (
              <div className="absolute left-0 mt-2 py-2 w-64 bg-white rounded-md shadow-lg z-100">
                <ul className="text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 transition duration-150">
                    <Link href="/bots/create-phone-cases" legacyBehavior>
                      <a className="block">Create Phone Case Bot</a>
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 transition duration-150">
                    <Link href="/bots/create-t-shirts" legacyBehavior>
                      <a className="block">Create T-Shirt Bot</a>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4"></div>
      </div>
    </nav>
  );
};

export default Navigation;
