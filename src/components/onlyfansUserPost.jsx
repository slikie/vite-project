import { useState, useEffect, useRef } from "react";
import { useParams, Route } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
// import LocalTheme from "../../theme";
import { Modal, Image } from "@nextui-org/react";
import { PhotoProvider, PhotoView, PhotoSlider } from 'react-photo-view';

export default function Page() {
  const { user } = useParams();
  // const { styles, theme, colorScheme } = LocalTheme();
  const [responseData, setResponseData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);
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
    setDisplayedPosts(responseData.slice(0, page * 10));
  }, [page, responseData]);

  useEffect(() => {
    // fetch data
  }, [isVideoModalOpen, videoModalURL]);
  const loadMore = () => {
    setDisplayedPosts(responseData.slice(0, page * 10));
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
      {displayedPosts.length ? (
        displayedPosts.map(post => (
          <div key={post.id} style={{ margin: 20 }}>
            <div>{post.date}</div>
            <div>{post.text}</div>

            <div style={{ flexDirection: 'row', alignItems: 'center' }}>
              {post.attachments.length > 0 &&
                post.attachments.map((attach) => {
                  if (/(\.m4v|\.mkv|\.mp4)$/.test(attach.url)) {
                    return <VideoPlaceholder url={attach.url} key={attach.url} />;
                  } else {
                    return <ImageAttachment url={attach.url} key={attach.url} />;
                  }
                })}
            </div>
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
