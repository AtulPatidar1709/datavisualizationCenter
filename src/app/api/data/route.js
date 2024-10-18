import axios from "axios";
import { NextResponse } from "next/server";
import { parse } from "papaparse";

const GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1l7GstWHc69HPV0irSdvoMIyHgtufUPKsbtCiNw7IKR0/gviz/tq?tqx=out:csv";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const gender = searchParams.get("gender");
    const age = searchParams.get("age");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const axiosResponse = await axios.get(GOOGLE_SHEET_URL);

    const data = parse(axiosResponse.data, { header: true }).data;

    let filteredData = data;

    if (gender) {
      filteredData = filteredData.filter(
        (entry) => entry.Gender.toLowerCase() === gender.toLowerCase()
      );
      // console.log("After gender filter:", filteredData);
    }

    if (age) {
      filteredData = filteredData.filter((entry) => {
        const entryAge = entry.Age.trim();
        const [minAge, maxAge] = parseAgeRange(age);

        if (entryAge.startsWith(">")) {
          const minEntryAge = parseInt(entryAge.slice(1), 10);
          return minAge > minEntryAge;
        } else if (entryAge.includes("-")) {
          const [entryMinAge, entryMaxAge] = entryAge.split("-").map(Number);
          return minAge >= entryMinAge && maxAge <= entryMaxAge;
        } else if (entryAge.endsWith("+")) {
          const minEntryAge = parseInt(entryAge.slice(0, -1), 10);
          return minAge >= minEntryAge;
        }
        return false;
      });
      // console.log("After age filter:", filteredData);
    }

    if (startDate) {
      filteredData = filteredData.filter((entry) => {
        const entryDate = new Date(entry.Day.split("/").reverse().join("-"));
        return entryDate >= new Date(startDate);
      });
      // console.log("After startDate filter:", filteredData);
    }

    if (endDate) {
      filteredData = filteredData.filter((entry) => {
        const entryDate = new Date(entry.Day.split("/").reverse().join("-"));
        return entryDate <= new Date(endDate);
      });
      // console.log("After endDate filter:", filteredData);
    }

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

// Function to parse the user-provided age range (e.g., '18-25')
function parseAgeRange(age) {
  if (age.includes("-")) {
    const [minAge, maxAge] = age.split("-").map(Number);
    return [minAge, maxAge];
  } else if (age.endsWith("+")) {
    const minAge = parseInt(age.slice(0, -1), 10);
    return [minAge, Infinity]; // Return Infinity for the upper limit if it's 56+
  }
  return [0, 0]; // Return default range if the age format is incorrect
}
