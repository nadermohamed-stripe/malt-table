"use client";

import Image from "next/image";
import { useState } from "react";
import HardcodedData from "../data";



export default function Secretsauce() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedPersonDetails, setSelectedPersonDetails] = useState(null);
  const [people, setPeople] = useState(HardcodedData);

  const handleRowClick = (person) => {
    setSelectedPerson(person);
    setSelectedPersonDetails(person);
    setShowModal(true);

    // Send the data to the backend
    sendDataToBackend(person);
  };

  const sendDataToBackend = (person) => {
    fetch("/api/send-transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from the backend:", data);
        // Update the state of the selected person
        const updatedPeople = people.map((p) => {
          if (p.CustomerID === person.CustomerID) {
            return { ...p, Status: "Transfered" };
          }
          return p;
        });
        setPeople(updatedPeople);
      })
      .catch((error) => {
        console.error("Error sending data to the backend:", error);
      });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Malt Secret Sauce
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title,
            email and role.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => {}} // Do nothing
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
                    InvoiceID
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Destination
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    CBP
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {people.map((person) => (
                  <tr
                    key={person.CustomerID}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowClick(person)}
                  >
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          <Image
                            className="h-13 w-13 rounded-full"
                            src={person.image}
                            alt=""
                            width={1000}
                            height={1000}
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
                      {person.InvoiceID}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      {person.Amount}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      {person.Destination}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      {person.CBP}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className={`w-6 h-6 ${
                            person.Status === "Transfered"
                              ? "text-green-500"
                              : "text-gray-500"
                          }`}
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2">
                          {person.Status || "Not Transfered"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Invoice Details
              </h3>
              {selectedPersonDetails && (
                <div className="mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        CustomerID:
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedPersonDetails.CustomerID}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        InvoiceID:
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedPersonDetails.InvoiceID}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Amount:</p>
                      <p className="text-sm text-gray-500">
                        {selectedPersonDetails.Amount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Destination:
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedPersonDetails.Destination}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">CBP:</p>
                      <p className="text-sm text-gray-500">
                        {selectedPersonDetails.CBP}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Status:</p>
                      <p
                        className={`text-sm ${
                          selectedPersonDetails.Status === "Transfered"
                            ? "text-green-500"
                            : "text-gray-500"
                        }`}
                      >
                        {selectedPersonDetails.Status || "Not Transfered"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}