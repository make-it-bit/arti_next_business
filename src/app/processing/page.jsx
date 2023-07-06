import ClientSideUI from "./components/ClientSideUI";

const Page = () => {
  return (
    <div className="text-center">
      <header>
        <h1 className="text-6xl font-semibold mx-2 mt-28 mb-20 bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-500 drop-shadow-xl">
          The results will appear here
        </h1>
      </header>
      <main>
        <ClientSideUI />
      </main>
    </div>
  );
};

export default Page;
