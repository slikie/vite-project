import { useState, useEffect } from "react";
import { Input, Button, Divider } from "@nextui-org/react";
import InfiniteScroll from 'react-infinite-scroller';
import { useParams } from "react-router-dom";
import { PostCard } from "./coomerPostCard";

export default function CoomerUserPostsComponent() {
    const { user } = useParams();
    const fav_posts_key = "favCoomerPosts";
    const [favoritedPosts, setFavoritedPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchFavData = () => {
            const result = getFavPosts();
            console.log(result)
            setFavoritedPosts(result);
        };
        fetchFavData();
    }, []);

    function isFavoritedPost(post) {
        return favoritedPosts.some((u) => u.id === post.id);
    }

    const getFavPosts = () => {
        const jsonValue = localStorage.getItem(fav_posts_key);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    };

    const addFavPost = (post) => {
        const favPosts = getFavPosts();

        const existing = favPosts.find((u) => u.id === post.id);
        if (!existing) {
            favPosts.push({ ...post, favDate: new Date() });
            localStorage.setItem(fav_posts_key, JSON.stringify(favPosts));
        }
    };

    const deleteFavPost = (post) => {
        let favPosts = getFavPosts();
        favPosts = favPosts.filter((u) => u.id !== post.id);
        localStorage.setItem(fav_posts_key, JSON.stringify(favPosts));
    };

    function handleFavPress(post) {
        if (isFavoritedPost(post)) {
            deleteFavPost(post);
        } else {
            addFavPost(post);
        }
        setFavoritedPosts(prevItems => {
            if (isFavoritedPost(post)) {
                return prevItems.filter(u => u.id !== post.id);
            } else {
                return [...prevItems, post];
            }
        });
    }

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
                        <>
                            <PostCard key={post.id} post={post} />
                            <Button
                                className={isFavoritedPost ? "bg-transparent text-foreground border-default-200" : ""}
                                color="primary"
                                radius="full"
                                size="sm"
                                variant={isFavoritedPost(post) ? "bordered" : "solid"}
                                onPress={() => handleFavPress(post)}
                            >
                                {isFavoritedPost(post) ? "⭐" : "☆"}
                            </Button>
                        </>
                    ))}
                </InfiniteScroll>

            )}
            <div>debug: post length {posts.length}</div>
        </>
    )
}