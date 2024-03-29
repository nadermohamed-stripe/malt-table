"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import HardcodedData from "../data";



export default function Customerbalance() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetchData();
    fetchtestapi();
  }, []);

  const fetchtestapi = async () => {
    try {
      const response = await fetch("/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Hello from the client!" }),
      });
      const data = await response.json();
      console.log(data);
    }
    catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const fetchData = async () => {
    try {
      const response = await fetch("/api/get-amounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ CustomerID: HardcodedData.map((p) => p.CustomerID) }),
      });
      const data = await response.json();
      const updatedPeople = HardcodedData.map((person) => ({
        ...person,
        Amount: data.find((p) => p.CustomerID === person.CustomerID)?.Amount,
      }));
      setPeople(updatedPeople);
    } catch (error) {
      console.error("Error fetching data:", error);
      setPeople(HardcodedData);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Customer Balance</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title, email and role.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={fetchData}
          >
            Refresh Data
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    CustomerID
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {Array.isArray(people) && people.length > 0 ? (
                  people.map((person) => (
                    <tr key={person.CustomerID}>
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            <Image
                              className="h-13 w-13 rounded-full"
                              src={person.image}
                              alt=""
                              width={900}
                              height={900}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {person.CustomerID}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {person.Amount || "Loading..."}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center py-5">
                      Loading...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}