import ClientSideUI from "./components/ClientSideUI";

const Page = () => {
  return (
    <div className="text-center">
      <header>
        <h1 className="text-6xl font-semibold mx-2 mt-28 mb-20 drop-shadow-xl py-2">
          <span className="min-[1220px]:inline-block bg-custom_black text-white p-1 rounded-md min-[1220px]:whitespace-nowrap">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-500">
              Processing Your data
            </span>
          </span>
        </h1>
      </header>
      <main>
        <ClientSideUI />
      </main>
    </div>
  );
};

export default Page;
