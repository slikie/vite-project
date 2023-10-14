import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { Input, Modal, Image, Divider, Card, CardHeader, CardBody, CardFooter, Avatar, Link } from "@nextui-org/react";
import { PhotoProvider, PhotoView, PhotoSlider } from 'react-photo-view';

export default function Page() {
  const { user } = useParams();
  const [responseData, setResponseData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [hasMoreItems, setHasMoreItems] = useState(true);

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
      <p> {url}</p>
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

  function PostText({ text }) {
    return (
      <span className="pt-2">{text}</span>
    );
  }
  useEffect(() => {
    const fetchUserData = async () => {
      fetch(`https://a.2345781.xyz/of/fetch/${user}?proxy=false`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          setResponseData(data);
          if (data.length === 0) {
            setErrorMessage("No results found.");
          }
        })
        .catch((error) => {
          console.error(error);
          setErrorMessage("An error occurred. Please try again later.");
        });
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
                  <div className="flex gap-5">
                    <Avatar isBordered radius="full" size="md" src={`https://img.coomer.party/icons/onlyfans/${user}`} />
                    <div className="flex flex-col gap-1 items-start justify-center">
                      <h4 className="text-small font-semibold leading-none text-default-600">{user}</h4>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="px-3 py-0 text-small text-default-400">
                  <PostText text={post.text}/>
                  <div className="grid grid-flow-row-dense grid-cols-3">
                    {post.attachments.length > 0 &&
                      post.attachments.map(attachment => {
                        const extension = attachment.url.split('.').pop();
                        if (videoExtensions.includes(extension)) {
                          return <VideoPlayer url={attachment.url} key={attachment.url} />;
                        } else if (audioExtensions.includes(extension)) {
                          return <AudioPlayer url={attachment.url} key={attachment.url} />;
                        } else if (photoExtensions.includes(extension)) {
                          return <ImagePlayer url={attachment.url} key={attachment.url} />;
                        } else {
                          return <FilePlayer url={attachment.url} key={attachment.url} />;
                        }
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
      {hasMoreItems && (
        <button onClick={loadMore}>Load more</button>
      )
      }
    </div>
  );
}
