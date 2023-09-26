import { useState } from "react";
import link from "../assets/link.svg";
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  const [getSummary] = useLazyGetSummaryQuery();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const { data } = await getSummary({ url: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      setArticle(newArticle);
    }
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center -items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={link}
            alt="link_icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />
          <input
            type="url"
            placeholder="Enter a Url"
            value={article.url}
            onChange={(event) =>
              setArticle({ ...article, url: event.target.value })
            }
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            ⏎
          </button>
        </form>
      </div>
    </section>
  );
};

export default Demo;
