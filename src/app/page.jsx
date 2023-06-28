import Form from "./components/Form";

export default function Home() {
  return (
    <div className="text-center">
      <header className="min-[300px]:pt-15 md:pt-20 pt-10 sm:px-4 lg:px-8 mx-auto">
        <h1 className="2xl:text-8xl lg:text-8xl text-3xl min-[300px]:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black to-custom_purple">
          Audits of{" "}
          <span className="min-[1220px]:inline-block bg-black text-white px-1 rounded-md min-[1220px]:whitespace-nowrap">
            Your business&apos;s online
          </span>
        </h1>
        <p className="mb-8 2xl:text-8xl lg:text-8xl text-3xl min-[300px]:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black to-custom_purple min-[1020px]:-translate-y-4">
          presence
        </p>
        <p className="block text-lg min-[300px]:text-xl sm:w-4/5 sm:mx-auto mx-4">
          Audit Your or someone elses business&apos;s online accessibility and
          get feedback based off how easy it is to find You/them (SEO),
          website&apos;s performance and so on.
        </p>
      </header>
      <main>
        <section className="md:my-12 md:px-6 md:py-4 w-5/6 md:w-4/5 lg:w-3/5 mx-auto backdrop-blur-sm rounded-md px-2 py-2 border-solid border-2 border-custom_purple">
          <h2 className="inline-block text-3xl font-semibold bg-black text-white px-1 rounded-md mb-4">
            How we can help You
          </h2>
          <p className="text-xl">
            We take the CSV file You provide, read the data in that file and get
            to work. First we check how much information can we receive about
            You/them from the business register (contact details, information
            about what You/they do, etc). Then we run a speed, accessibility,
            SEO (search engine optimization) and user friendliness test on Your
            website. After that we process the results and let You know what
            would need improvement.
          </p>
        </section>
        <section className="section-background h-96 w-4/5 mx-auto my-12 flex flex-col justify-center">
          <h2 className="w-fit inline-block mx-auto -translate-y-4 text-4xl font-semibold bg-custom_purple text-white px-1 rounded-md mb-4 border-solid border-2 border-[#001220]">
            Lets Start here
          </h2>
          <Form />
        </section>
      </main>
    </div>
  );
}
