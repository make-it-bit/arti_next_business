"use client";
import { useState } from "react";

const Form = () => {
  return (
    <form className="flex flex-col w-3/5 mx-auto ">
      <label className="text-left text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-500">
        Official name of the Business
      </label>
      <input
        type="name"
        placeholder="For example 'AABITS OÜ'"
        required
        className="rounded-md py-1 px-2 mb-2 text-black font-medium focus:outline-none text-lg"
      />
      <label
        htmlFor="csv_file"
        className="bg-[#001220] border-solid border-2 border-custom_purple text-black rounded-md mt-2 p-1 font-medium text-xl"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-500">
          Submit the correctly formatted CSV file here
        </span>
        <input
          type="file"
          required
          className="hidden"
          id="csv_file"
          name="file"
        />
      </label>
      <button className="bg-custom_purple border-solid border-2 border-[#001220] text-black sm:w-3/5 mx-auto rounded-md mt-4 p-1 font-medium text-xl">
        Run checks
      </button>
    </form>
  );
};

export default Form;
