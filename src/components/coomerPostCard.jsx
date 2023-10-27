import CoomerMediaPlayer from "./coomerMediaPlayer";
import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardFooter, Divider, User, Button } from "@nextui-org/react";
import { Link } from "react-router-dom";

function UserLink({ username }) {
    const [exists, setExists] = useState(false);

    useEffect(() => {
        async function checkUserExists() {
            const response = await fetch(`https://a.2345781.xyz/of/${username}`);
            const data = await response.json();
            setExists(data.onCoomer);
              console.log(username, data.onCoomer)
        }

        checkUserExists();
    }, [username]);

    if (!exists) {
        return <span>@{username}</span>;
    }

    return <a href={`/user/${username}`}>@{username}</a>;
}

function PostText({ text }) {
    const regex = /(@\w+|onlyfans\.com\/\w+)/ig;

    return (
        <b class="pt-2">
            {text.split(regex).map((part, index) => {
                if (index % 2 === 0) {
                    return part;
                }
                const username = part.replace(/^@|onlyfans\.com\//ig, '');
                return <UserLink key={index} username={username} />;
            })}
        </b>
    );
}

export function PostCard({ post }) {
    const fav_posts_key = "favCoomerPosts";
    const [favoritedPosts, setFavoritedPosts] = useState([]);

    useEffect(() => {
        const fetchFavData = () => {
            const result = getFavPosts();
            // console.log(result)
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


    return (
        <>
            <Card className="w-screen max-w-screen-md">

                <CardHeader className="justify-between">
                    <Link to={`/user/${post.user}`} size="sm" isExternal>
                        <User
                            name={post.user}
                            description={`@${post.user}`}
                            avatarProps={{ src: `https://img.coomer.su/icons/${post.service}/${post.user}` }}
                        />
                    </Link>
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
                </CardHeader>

                <CardBody className="px-3 py-0 text-small text-default-400">
                    <PostText text={post.content} />
                    <div className="grid grid-flow-row-dense grid-cols-3">
                        {post.attachments.length > 0 &&
                            post.attachments.map(attachment => {
                                return <CoomerMediaPlayer url={attachment.path} user={post.user} />
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
            <Divider className="my-4" />
        </>
    )
}