import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { Input, User, Image, Divider, Card, CardHeader, CardBody, CardFooter, Avatar, Link } from "@nextui-org/react";
import Linkify from 'linkify-react';
import "linkify-plugin-mention";
import { PostCard } from "./onlyfansSearchPost";

export default function Page() {
  const { user } = useParams();
  const [responseData, setResponseData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [hasMoreItems, setHasMoreItems] = useState(true);

  function PostText({ text }) {


    const option = {
      formatHref: {
        mention: (href) => "/onlyfans/" + href,
      },

      // render: { mention: renderLink, },
      // attributes: {
      //   onClick: (event) => {
      //     if (!confirm('Are you sure you want to leave this page?')) {
      //        event.preventDefault()
      //     }
      //   }
      // }
    };
    return (
      <Linkify class="pt-2" as={"div"} options={option}>
        {text}
      </Linkify>
    );
  }
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://a.2345781.xyz/of/fetch/${user}?proxy=false`,
          {
            method: "GET",
          }
        );

        if (response.status === 404) {
          setErrorMessage("User not found.");
          return;
        }

        const data = await response.json();

        setResponseData(data);

        if (data.length === 0) {
          setErrorMessage("No results found.");
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("An error occurred. Please try again later.");
      }
    };
    fetchUserData();
    console.log('fetch hook 1')
  }, []);

  useEffect(() => {
    setDisplayedPosts(responseData.filter(post =>
      post.text.toLowerCase().includes(filterValue.toLowerCase())
    ).slice(0, page * 10));
    console.log('fetch hook 2')

    setHasMoreItems(displayedPosts.length < responseData
      .filter(post => post.text.toLowerCase().includes(filterValue.toLowerCase())).length);
  }, [page, responseData, filterValue]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  function Posts() {
    return (
      <div>
        <Input
          placeholder="filtering"
          value={filterValue}
          onValueChange={setFilterValue}
        />
        <Link href={`https://a.2345781.xyz/of/fetch/${user}?format=m3u8&query=${filterValue}`}>
          <button >m3u8 play</button>
        </Link>
        <Link href={`https://a.2345781.xyz/of/fetch/${user}?refetch=true`}>
          <button >refetch</button>
        </Link>
        <InfiniteScroll
          loadMore={loadMore}
          hasMore={hasMoreItems}
          initialLoad={false}
          loader={<div key={0}>Loading ...</div>}
        >
          {(
            displayedPosts.map(post => (
              <div key={post.id} style={{ margin: 20 }}>
                <PostCard key={post.id} post={post} />
                <Divider className="my-4" />
              </div>
            ))
          )}
        </InfiniteScroll>
      </div>
    )
  }

  return (
    <div>
      {errorMessage ? (<h4> {errorMessage}</h4 >) : (Posts(user))}
    </div>
  );
}
