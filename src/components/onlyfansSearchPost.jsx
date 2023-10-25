import { useState, useEffect } from "react";
import { Input, Button, Card, CardBody, CardHeader, CardFooter, Avatar, Divider, User, Image } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";

export default function OFSearchPostComponent() {

    const [searchQuery, setSearchQuery] = useState("");
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        setErrorMessage("");
        setPosts([]);
        setPage(0);
        setIsLoading(true);

        try {
            const response = await fetch(`https://a.2345781.xyz/ofv2/posts?q=${searchQuery}&o=${page}`);
            const data = await response.json();
            if (response.status === 404) {
                setErrorMessage("404? maybe the api has been broken.");
                return;
            }
            if (data.length === 0) {
                setErrorMessage("No results found.");
            }
            setPosts(prevPosts => [...prevPosts, ...data]);
            // setPage(prevPage => prevPage + 50);
            setIsLoading(false);

        } catch (error) {
            console.error(error);
            setErrorMessage("An unknown error occurred. Please try again later.");
            setIsLoading(false);
        }
    }

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
                onClick={handleSearch}
            >
                Search
            </Button>
            {errorMessage ? (<h4> {errorMessage}</h4 >) : (posts.map(post => (
                <PostCard key={post.id} post={post} />
            )))}



            {/* <Button
                disabled={isLoading}
                onClick={handleSearch}
            >
                Load more
            </Button> */}
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
