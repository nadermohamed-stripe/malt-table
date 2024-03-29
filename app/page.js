import Secretsauce from "./(components)/Secretsauce";
import Customerbalance from "./(components)/Customerbalance";
import Transferlist from "./(components)/Transferlist";

export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      <div>
        <Transferlist />
      </div>

      <hr className="my-6 border-2 rounded-full border-black-500" />
      <div className="mt-auto">
        <Secretsauce />
      </div>
      <hr className="my-6 border-2 rounded-full border-black-500" />

      <div className="mt-auto">
        <Customerbalance />
      </div>
    </main>
  );
}