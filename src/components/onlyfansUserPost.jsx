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

  const videoExtensions = ['mkv', 'avi', 'mp4', 'ogv', 'webm', 'rmvb', 'flv', 'wmv', 'mpeg', 'mpg', 'm4v', '3gp', 'mov', 'ts'];
  const audioExtensions = ['mp3', 'wav', 'wma', 'aac', 'flac', 'm4a', 'ogg'];
  const photoExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'raw', 'heif', 'heic', 'svg', 'psd', 'ai'];

  const VideoPlayer = ({ url }) => (
    <>
      <video controls preload="none" poster={`https://img.coomer.party/icons/onlyfans/${user}`} classNames="m-5">
        <source src={url} type="video/mp4" />
      </video>
    </>
  );


  const FilePlayer = ({ url }) => (
    <>
      <p> {url}</p>
    </>
  );


  const AudioPlayer = ({ url }) => (
    <>
      <video controls preload="none" poster={`https://img.coomer.party/icons/onlyfans/${user}`} classNames="m-5">
        <source src={url} type="video/mp4" />
      </video>
    </>
  );

  const ImagePlayer = ({ url }) => (
    <>
      <Image
        isZoomed
        width={240}
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
    setDisplayedPosts(responseData.filter(post =>
      post.text.toLowerCase().includes(filterValue.toLowerCase())
    ).slice(0, page * 10));

  }, [page, responseData, filterValue]);

  const loadMore = () => {
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
                <div className="grid grid-cols-2 gap-2">
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

      {displayedPosts.length < responseData.length && (
        <button onClick={loadMore}>Load more</button>
      )}
    </div>
  );
}
