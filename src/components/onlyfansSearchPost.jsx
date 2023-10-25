import { useState, useEffect } from "react";
import { Input, Button, Card, CardBody, CardHeader, CardFooter, Avatar, Divider, User, Image } from "@nextui-org/react";
import InfiniteScroll from 'react-infinite-scroller';
import { Link, useNavigate } from "react-router-dom";

export default function OFSearchPostComponent() {

    const [searchQuery, setSearchQuery] = useState("");
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const loadMore = async () => {
        try {
            setErrorMessage("");
            if (searchQuery === "") {
                // if empty, set hasMore to false to stop loading more data
                setHasMore(false);
                return;
            }
            const url = `https://a.2345781.xyz/ofv2/posts?q=${searchQuery}&o=${page}`;
            const response = await fetch(url);
            const data = await response.json();
            if (response.status === 404) {
                setErrorMessage("404? maybe the api has been broken.");
                return;
            }
            if (data.length === 0) {
                setHasMore(false);
            } else {
                setHasMore(true);
                setPosts(posts.concat(data));
                setPage(page + 50);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("An unknown error occurred. Please try again later.");
        }
    };

    return (
        <>
            <Input
                placeholder="Search posts"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
            />

            <Button
                icon="search"
                loading={isLoading}
                onClick={loadMore}
            >
                Search
            </Button>
            {errorMessage ? (<h4> {errorMessage}</h4 >) : (

                <InfiniteScroll
                    pageStart={0}
                    loadMore={loadMore}
                    hasMore={hasMore}
                    loader={<div key={0}>Loading ...</div>}
                >
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </InfiniteScroll>

            )}
            <div>debug: post length {posts.length}</div>
        </>
    )
}

function Media({ url, user }) {
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


function PostCard({ post }) {

    return (
        <Card className="w-screen max-w-screen-md">

            <CardHeader className="justify-between">
                <User
                    name={post.user}
                    description={(
                        <Link href={`https://twitter.com/${post.user}`} size="sm" isExternal>
                            @{post.user}
                        </Link>
                    )}
                    avatarProps={{ src: `https://img.coomer.su/icons/${post.service}/${post.user}` }}
                />
            </CardHeader>

            <CardBody className="px-3 py-0 text-small text-default-400">

                <b>{post.content}</b>
                <div className="grid grid-flow-row-dense grid-cols-3">
                    {post.attachments.length > 0 &&
                        post.attachments.map(attachment => {
                            return <Media url={attachment.path} user={post.user} />
                        })
                    }
                </div>

            </CardBody>

            <CardFooter className="gap-3">

                <div className="flex gap-1">
                    <b className="text-default-400 text-small">
                        {post.published}
                    </b>
                </div>

            </CardFooter>

        </Card>
    )
}
