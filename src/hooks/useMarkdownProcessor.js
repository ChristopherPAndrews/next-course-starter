import { useState, useEffect, createElement } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import rehypePrism from "@mapbox/rehype-prism";

import Collapsable from "../components/Collapsable";

/**
 * Hook to convert the Markdown to React. This avoids setting the html directly by creating a React element.
 *
 * I got guidance from
 * https://unifiedjs.com/learn/guide/using-unified/
 * https://developer.aliyun.com/mirror/npm/package/rehype-prism
 * https://github.com/rehypejs/rehype-react
 * https://github.com/rehypejs/rehype-raw
 *
 * Note that because of the way rehype-raw works, there needs to be a space before markdown blocks
 * inside of html tags, otherwise it is seen as html.
 *
 * A thought about Collapsable -- the truth is that the detail and summary tags
 * do essentially the same thing. I am leaving it in, however, as an example
 * of how to integrate React components into the markdown
 *
 * @param {*} markdown - string holding markdown data
 */
export default function useMarkdownProcessor(markdown) {
  const [content, setContent] = useState(Fragment);

  useEffect(() => {
    const parseMarkdown = async (md) => {
      const data = await unified()
        .use(remarkParse) // read the markdown
        .use(remarkGfm) // add git-flavored syntax (and make tables work)
        .use(remarkMath) // capture latex escapes
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeKatex) // render the math
        .use(rehypePrism) // use Prism to highlight the code
        .use(rehypeSlug) // add ids for anchor links to headers
        .use(rehypeRaw) // pick up the raw HTML blocks and convert them into
        .use(rehypeReact, {
          createElement,
          Fragment,
          jsx,
          jsxs,
          components: {
            hidden: Collapsable,
          },
        }) // compiles the result into a React element
        .process(md);

      setContent(data.result);
    };

    parseMarkdown(markdown);
  }, [markdown]);

  return content;
}
