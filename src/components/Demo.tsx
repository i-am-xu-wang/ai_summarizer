import { useEffect, useState } from "react";
import link from "../assets/link.svg";
import { useLazyGetSummaryQuery } from "../services/article";
import copy from "../assets/copy.svg";
import loader from "../assets/loader.svg";
import tick from "../assets/tick.svg";
interface IArticle {
  url: string;
  summary: string;
}

const Demo = () => {
  const [article, setArticle] = useState<IArticle>({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState<IArticle[]>([]); // [article1, article2, article3
  const [copied, setCopied] = useState<string>("");

  const [getSummary, { isFetching, error }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles") || "[]",
    );
    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = await getSummary({ url: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];
      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  const handleCopy = (copyUrl: string) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(""), 3000);
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

        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((article, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(article)}
              className="link_card"
            >
              <div className="copy_btn" onClick={() => handleCopy(article.url)}>
                <img
                  src={copied === article.url ? tick : copy}
                  alt="copy_icon"
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                {article.url}
              </p>
            </div>
          ))}
        </div>

        <div className="my-10 max-w-full flex justify-center items-center">
          {isFetching ? (
            <img
              src={loader}
              alt="loader"
              className="w-20 h-20 object-contain"
            />
          ) : error ? (
            <p className="font-inter font-bold text-black text-center">
              Well, that was unexpected.Please try again later.
              <br />
              <span>
                {"data" in error && typeof error.data === "string"
                  ? error.data
                  : "Error without data"}
              </span>
            </p>
          ) : (
            article.summary && (
              <div className="flex flex-col gap-3">
                <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                  Article <span className="blue_gradient">Summary</span>
                </h2>
                <div className="summary_box">
                  <p className="font-inter font-medium  text-sm text-gray-700">
                    {article.summary}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Demo;
