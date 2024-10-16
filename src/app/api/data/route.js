import axios from "axios";
import { NextResponse } from "next/server";
import { parse } from "papaparse";

const GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1l7GstWHc69HPV0irSdvoMIyHgtufUPKsbtCiNw7IKR0/gviz/tq?tqx=out:csv";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url); // Get the query parameters
    const gender = searchParams.get("gender");
    const age = searchParams.get("age");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Fetch the CSV data from the Google Sheet
    const axiosResponse = await axios.get(GOOGLE_SHEET_URL);

    // Parse the CSV data using PapaParse
    const data = parse(axiosResponse.data, { header: true }).data;

    // Filter data based on the provided filters
    let filteredData = data; // Assume 'data' is your parsed dataset

    if (gender) {
      filteredData = filteredData.filter(
        (entry) => entry.Gender.toLowerCase() === gender.toLowerCase()
      );
      console.log(`Filtered by gender (${gender}):`, filteredData);
    }

    if (age) {
      filteredData = filteredData.filter((entry) => {
        const entryAge = entry.Age.trim(); // Clean entry age value
        const userAge = parseAge(age); // Call a function to get the age range min and max

        if (entryAge.startsWith(">")) {
          const minAge = parseInt(entryAge.slice(1), 10);
          return userAge > minAge;
        } else if (entryAge.includes("-")) {
          const [minAge, maxAge] = entryAge.split("-").map(Number);
          return userAge >= minAge && userAge <= maxAge;
        } else if (entryAge.endsWith("+")) {
          const minAge = parseInt(entryAge.slice(0, -1), 10);
          return userAge >= minAge;
        }
        return false;
      });
    }

    if (startDate) {
      filteredData = filteredData.filter((entry) => {
        const entryDate = new Date(entry.Day.split("/").reverse().join("-")); // Convert 'DD/MM/YYYY' to 'YYYY-MM-DD'
        return entryDate >= new Date(startDate);
      });
      console.log(`Filtered by start date (${startDate}):`, filteredData);
    }

    if (endDate) {
      filteredData = filteredData.filter((entry) => {
        const entryDate = new Date(entry.Day.split("/").reverse().join("-")); // Convert 'DD/MM/YYYY' to 'YYYY-MM-DD'
        return entryDate <= new Date(endDate);
      });
      console.log(`Filtered by end date (${endDate}):`, filteredData);
    }

    console.log("Incoming filters:", { gender, age, startDate, endDate });
    console.log("Filtered data:", filteredData);

    // Return the transformed data as JSON using NextResponse
    return NextResponse.json(filteredData);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
