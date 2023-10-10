import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import { Input, Modal, Image, Divider, Card, CardHeader, CardBody, CardFooter, Avatar, Link } from "@nextui-org/react";
import { PhotoProvider, PhotoView, PhotoSlider } from 'react-photo-view';

export default function Page() {
  const { user } = useParams();
  const [responseData, setResponseData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  // Add state to track the video URL to show in modal
  const [videoModalURL, setVideoModalURL] = useState(null);

  const VideoPlaceholder = ({ url }) => (
    <>
      <video controls width="320" height="240">
        <source src={url} type="video/mp4" />
      </video>
    </>
  );

  // Add modal that conditionally shows if video modal state is open

  const ImageAttachment = ({ url }) => (
    <>
      <Image
        isZoomed
        width={240}
        alt="NextUI Fruit Image with Zoom"
        src={url}
        classNames="m-5"
      />
    </>
  );
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
  }, []);

  useEffect(() => {
    // setDisplayedPosts(responseData.slice(0, page * 10));
    setDisplayedPosts(responseData.filter(tab =>
      tab.text.includes(filterValue)
    ).slice(0, page * 10));

  }, [page, responseData, filterValue]);

  useEffect(() => {
    // fetch data
  }, [isVideoModalOpen, videoModalURL]);
  const loadMore = () => {
    // setDisplayedPosts(responseData.slice(0, page * 10));
    setDisplayedPosts(responseData.filter(tab =>
      tab.text.includes(filterValue)
    ).slice(0, page * 10));
    setPage((prevPage) => prevPage + 1);
  };

  //         {isVideoModalOpen && (
  //             <Modal
  //                 animationType="slide"
  //                 transparent={false}
  //                 visible={isVideoModalOpen}
  //             >
  //                 <Modal.Header>
  //                     <Button title="Close" onPress={() => setIsVideoModalOpen(false)} />
  //                 </Modal.Header>
  //                 <Video
  //                     source={{ uri: videoModalURL }}
  //                     resizeMode={ResizeMode.CONTAIN}
  //                     useNativeControls
  //                     shouldPlay
  //                     onClose={() => setIsVideoModalOpen(false)}
  //                     style={{ height: 200 }}
  //                 />
  //             </Modal>
  //         )}
  //     </div>
  // );
  return (
    <div>
      <Input
        placeholder="filtering"
        value={filterValue}
        onValueChange={setFilterValue}
      />
      <Link href={`https://a.2345781.xyz/of/fetch/${user}?format=m3u8`}>
        <button >m3u8 play</button>
      </Link>
      {displayedPosts.length ? (
        displayedPosts.map(post => (
          <div key={post.id} style={{ margin: 20 }}>
            <Card className="max-w-[550px]">
              <CardHeader className="justify-between">
                <div className="flex gap-5">
                  {/* <Avatar isBordered radius="full" size="md" src={item.avatar} /> */}
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-default-600">{user}</h4>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="px-3 py-0 text-small text-default-400">
                <span className="pt-2">{post.text}</span>
                <div className="flex">
                  {post.attachments.length > 0 &&
                    post.attachments.map((attach) => {
                      if (/(\.m4v|\.mkv|\.mp4)$/.test(attach.url)) {
                        return <VideoPlaceholder url={attach.url} key={attach.url} />;
                      } else {
                        return <ImageAttachment url={attach.url} key={attach.url} />;
                      }
                    })}
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

      {displayedPosts.length < responseData.length && (
        <button onClick={loadMore}>Load more</button>
      )}
    </div>
  );
}
