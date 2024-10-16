// pages/index.js
import Head from "next/head";
import AnalyticsDashboard from "../components/AnalyticsDashboard";

const Home = () => {
  return (
    <>
      <Head>
        <title>Analytics Dashboard</title>
        <meta name="description" content="Interactive Analytics Dashboard" />
      </Head>
      <AnalyticsDashboard />
    </>
  );
};

export default Home;
