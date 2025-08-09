import React from "react";
import Banner from "../components/Banner";
import Feature from "./Feature";
import Faq from "./Faq";

export default function Home() {
  return (
    <div>
      {/* banner section */}
      <section>
        <Banner></Banner>
      </section>
      <section>
        <Feature></Feature>
      </section>
      <section>
        <Faq></Faq>
      </section>
    </div>
  );
}
