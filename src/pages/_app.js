import "../styles/globals.css";
import "../styles/prism-tomorrow.css";
import Layout from "../components/Layout";
import Collapsable from "../components/Collapsable";
import { MDXProvider } from "@mdx-js/react";

import React from "react";

const components = {
  hiddenBlock: Collapsable,
};

function MainApp({ Component, pageProps }) {
  return (
    <MDXProvider components={components}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MDXProvider>
  );
}

export default MainApp;
