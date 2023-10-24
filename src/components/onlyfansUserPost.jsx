import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { Input, User, Image, Divider, Card, CardHeader, CardBody, CardFooter, Avatar, Link } from "@nextui-org/react";
import { PhotoProvider, PhotoView, PhotoSlider } from 'react-photo-view';
import Linkify from 'linkify-react';
import "linkify-plugin-mention";

export default function Page() {
  const { user } = useParams();
  const [responseData, setResponseData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [hasMoreItems, setHasMoreItems] = useState(true);

  function Media({ url }) {
    const extension = url.split('.').pop();

    const videoExtensions = ['mkv', 'avi', 'mp4', 'ogv', 'webm', 'rmvb', 'flv', 'wmv', 'mpeg', 'mpg', 'm4v', '3gp', 'mov', 'ts'];
    const audioExtensions = ['mp3', 'wav', 'wma', 'aac', 'flac', 'm4a', 'ogg'];
    const photoExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'raw', 'heif', 'heic', 'svg', 'psd', 'ai'];

    const VideoPlayer = ({ url }) => (
      <div class="col-span-2">
        <video controls preload="none" poster={`https://img.coomer.party/icons/onlyfans/${user}`} class="m-5 w-60">
          <source src={url} type="video/mp4" />
        </video>
      </div>
    );

    const FilePlayer = ({ url }) => (
      <>
        <p> idk what to open this with. here's the url -  {url}</p>
      </>
    );

    const AudioPlayer = ({ url }) => (
      <>
        <video controls preload="none" poster={`https://img.coomer.party/icons/onlyfans/${user}`} classnames="m-5">
          <source src={url} type="video/mp4" />
        </video>
      </>
    );

    const ImagePlayer = ({ url }) => (
      <>
        <Image
          isZoomed
          loading="lazy"
          width={240}
          src={url}
          classnames="m-5"
        />
      </>
    );

    if (videoExtensions.includes(extension)) {
      return <VideoPlayer url={url} key={url} />;
    } else if (audioExtensions.includes(extension)) {
      return <AudioPlayer url={url} key={url} />;
    } else if (photoExtensions.includes(extension)) {
      return <ImagePlayer url={url} key={url} />;
    } else {
      return <FilePlayer url={url} key={url} />;
    }
  }

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
        >
          {displayedPosts.length ? (
            displayedPosts.map(post => (
              <div key={post.id} style={{ margin: 20 }}>
                <Card className="w-screen max-w-screen-md">
                  <CardHeader className="justify-between">
                    <User
                      name={user}
                      description={(
                        <Link href={`https://twitter.com/${user}`} size="sm" isExternal>
                          @{user}
                        </Link>
                      )}
                      avatarProps={{
                        src: `https://img.coomer.party/icons/onlyfans/${user}`
                      }}
                    />
                  </CardHeader>
                  <CardBody className="px-3 py-0 text-small text-default-400">
                    <PostText text={post.text} />
                    <div className="grid grid-flow-row-dense grid-cols-3">
                      {post.attachments.length > 0 &&
                        post.attachments.map(attachment => {
                          return <Media url={attachment.url}></Media>
                        })
                      }
                    </div>
                  </CardBody>
                  <CardFooter className="gap-3">
                    <div className="flex gap-1">
                      <p className="text-default-400 text-small">Date</p>
                      <p className="font-semibold text-default-400 text-small">{post.date}</p>
                    </div>
                  </CardFooter>
                </Card>
                <Divider className="my-4" />
              </div>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </InfiniteScroll>
        {/* {hasMoreItems && (
          <button onClick={loadMore}>Load more</button>
        )} */}
      </div>
    )
  }

  return (
    <div>
      {errorMessage ? (<h4> {errorMessage}</h4 >) : (Posts(user))}
    </div>
  );
}
