"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import HardcodedData from "../data";



export default function Transferlist() {
  const [people, setPeople] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const customerIDs = HardcodedData.map((p) => p.CustomerID);
      const customerCashBalanceData = await fetchCashBalanceData(customerIDs);
      setPeople(customerCashBalanceData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setPeople(HardcodedData);
    }
  };

  const fetchCashBalanceData = async (customerIDs) => {
    try {
      const response = await fetch("/api/get-ccsbtxn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ CustomerID: customerIDs }),
      });
      const data = await response.json();
      return data.flatMap((customer) =>
        customer.CashBalanceTransactions.map((transaction) => ({
          CustomerID: customer.CustomerID,
          TransactionID: transaction.id,
          NetAmount: transaction.net_amount,
          image: HardcodedData.find((p) => p.CustomerID === customer.CustomerID)?.image,
        }))
      );
    } catch (error) {
      console.error("Error fetching cash balance data:", error);
      throw error;
    }
  };

  const handleRowClick = async (transaction) => {
    const transactionData = await fetchTransactionData(transaction.CustomerID, transaction.TransactionID);
    setSelectedTransaction(transactionData);
  };

  const fetchTransactionData = async (customerID, transactionID) => {
    try {
      const response = await fetch("/api/get-ccsbtxn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ CustomerID: [customerID], TransactionID: transactionID }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching transaction data:", error);
      throw error;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Cash Balance Transactions</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the cash balance transactions for your customers.
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
                    Transaction ID
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Net Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {Array.isArray(people) && people.length > 0 ? (
                  people.map((transaction) => (
                    <tr
                      key={`${transaction.CustomerID}-${transaction.TransactionID}`}
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => handleRowClick(transaction)}
                    >
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            <Image
                              className="h-13 w-13 rounded-full"
                              src={transaction.image || "/Loreal-Symbol.jpg"}
                              alt=""
                              width={900}
                              height={900}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{transaction.CustomerID}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {transaction.TransactionID}
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {transaction.NetAmount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-5">
                      Loading...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedTransaction && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Cash Balance Transaction Details
              </h3>
              <div className="mt-2">
                <pre className="text-sm text-gray-500">
                  {JSON.stringify(selectedTransaction, null, 2)}
                </pre>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  onClick={() => setSelectedTransaction(null)}
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