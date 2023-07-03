import Form from "./components/Form";
import Image from "next/image";
import Link from "next/link";
import tutorialPic from "../../public/tutorial.png";

export default function Home() {
  return (
    <div className="text-center">
      <header className="min-[300px]:pt-15 md:pt-20 pt-10 sm:px-4 lg:px-8 px-2 mx-auto">
        <h1 className="2xl:text-8xl lg:text-8xl text-3xl min-[300px]:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-custom_purple to-black">
          Audits of{" "}
          <span className="min-[1220px]:inline-block bg-black text-white px-1 rounded-md min-[1220px]:whitespace-nowrap">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-500">
              Your business&apos;s online
            </span>
          </span>
        </h1>
        <p className="mb-8 2xl:text-8xl lg:text-8xl text-3xl min-[300px]:text-5xl font-bold min-[1020px]:-translate-y-4 bg-clip-text text-transparent bg-gradient-to-r from-custom_purple to-black">
          presence
        </p>
        <p className="block text-lg min-[300px]:text-xl sm:w-4/5 sm:mx-auto mx-4 mb-8">
          Audit Your or someone elses business&apos;s (preferably a car
          dealership) online accessibility and get feedback based off how easy
          it is to find You/them (SEO), website&apos;s performance and so on.
        </p>
      </header>
      <main>
        <section className="md:my-12 md:px-6 md:py-4 w-5/6 md:w-4/5 lg:w-3/5 mx-auto backdrop-blur-sm rounded-md px-2 py-2 border-solid border-2 border-custom_purple ">
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
        <section className="section-background bg-custom_black h-fit w-5/6 lg:w-9/12 mx-auto my-12 flex flex-col justify-center border-solid border-2 border-custom_black rounded-md pt-8 pb-4 sm:pb-12">
          <h2 className="w-fit inline-block mx-auto -translate-y-4 text-4xl py-1 px-2 font-semibold bg-custom_purple text-white px-1 rounded-md mb-4">
            Lets Start here
          </h2>
          <p className="px-2 text-lg font-medium text-white sm:bg-clip-text sm:text-transparent sm:bg-gradient-to-r sm:from-white sm:to-pink-500 -translate-y-6">
            For instructions regarding the .csv file look down below.
          </p>
          <Form />
        </section>
        <section className="bg-custom_black section-background border-solid border-t-2 border-custom_purple py-8">
          <div className="backdrop-blur-sm bg-custom_purple/90 rounded-md w-5/6 mx-auto border-solid border-2 border-[#001220] p-2 sm:4 md:p-8 sm:pt-2">
            <h2 className="inline-block text-3xl font-semibold bg-black text-white px-1 rounded-md mt-6 mb-8">
              How to format the .csv file properly
            </h2>
            <div className="mx-auto max-w-4/5 overflow-x-auto rounded-md">
              <Image
                src={tutorialPic}
                alt="Example of the .csv file"
                className="max-w-[800px] mx-auto min-w-[400px] rounded-md"
              />
            </div>
            <p className="sm:w-10/12 mx-auto mt-8 text-lg font-medium">
              The &quot;name&quot; column should represent how the company is
              called, not its official name. The &quot;website&quot; column
              should include the company&apos;s website&apos;s address.
              &quot;used&quot; and &quot;new&quot; should provide true or false
              value based on which type of cars the company sells, for example
              if a company sells used cars, then it should be marked as
              &quot;1&quot;, if not then &quot;0&quot;. The &quot;car park
              size&quot; column should tell us how many cars does the company
              have in its lot, acceptable values are as follows: any number from
              1-100, 100+ (which marks any amount between 100 and 1000, 1000+
              and 10000+ follow the same logic), 1000+ and 10000+. The
              &quot;ärinimi&quot; column should provide us a name under which
              the company is legally registered (found in the{" "}
              <Link
                href="https://www.inforegister.ee/"
                rel="norefferer noopener"
                className="underline"
              >
                Estonian Business Registry
              </Link>
              ).
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
