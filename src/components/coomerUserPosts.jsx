import { useState } from "react";
import { Input, Button, Divider } from "@nextui-org/react";
import InfiniteScroll from 'react-infinite-scroller';
import { useParams } from "react-router-dom";
import { PostCard } from "./coomerPostCard";

export default function CoomerUserPostsComponent() {
    const { user } = useParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const loadMore = async () => {
        try {
            setErrorMessage("");

            const url = `https://a.2345781.xyz/ofv2/onlyfans/user/${user}?q=${searchQuery}&o=${page}`;
            const response = await fetch(url);
            const data = await response.json();
            if (response.status === 404) {
                setErrorMessage("404? maybe the api has been broken.");
                return;
            }
            if (data.length === 0) {
                setHasMore(false);
                if (page === 0) {
                    setErrorMessage("User not found");
                }
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