import { useState, useEffect } from "react";
import { Input, Button, Card, CardBody, CardHeader, CardFooter, Avatar, Divider, Link } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export const OFLookupComponent = () => {
    const navigate = useNavigate();
    const fav_user_key = "favUsers";
    const [favoritedUsers, setFavoritedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [responseData, setResponseData] = useState([]);
    const [inputText, setInputText] = useState("");
    let prevValue;
    const [errorMessage, setErrorMessage] = useState("");



    function isFavorited(user) {
        return favoritedUsers.some((u) => u.id === user.id);
    }

    const getFavUsers = () => {
        const jsonValue = localStorage.getItem(fav_user_key);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    };

    const addFavUser = (user) => {
        const favUsers = getFavUsers();

        const existing = favUsers.find((u) => u.id === user.id);
        if (!existing) {
            favUsers.push(user);
            localStorage.setItem(fav_user_key, JSON.stringify(favUsers));
        }
    };

    const deleteFavUser = (user) => {
        let favUsers = getFavUsers();
        favUsers = favUsers.filter((u) => u.id !== user.id);
        localStorage.setItem(fav_user_key, JSON.stringify(favUsers));
    };

    useEffect(() => {
        const fetchFavData = () => {
            const result = getFavUsers();
            console.log(result)
            setFavoritedUsers(result);
        };
        fetchFavData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (inputText !== prevValue) {
                prevValue = inputText;
                // if i use state, it doesnt work???
                handleOFSubmit();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [inputText]);

    const handleButtonClick = (id) => {
        navigate(`/onlyfans/${id}`);
    }
    const handleOFSubmit = () => {
        setIsLoading(true);
        setErrorMessage("");

        fetch(`https://a.2345781.xyz/of/search/${inputText}`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                setResponseData(data);
                setIsLoading(false);
                if (data.length === 0) {
                    setErrorMessage("No results found.");
                }
            })
            .catch((error) => {
                console.error(error);
                setErrorMessage("An error occurred. Please try again later.");
            });
    };

    function UserCard({ userItem }) {

        const handleFavPress = () => {
            if (isFavorited(userItem)) {
                deleteFavUser(userItem);
            } else {
                addFavUser(userItem);
            }
            setFavoritedUsers(prevUsers => {
                if (isFavorited(userItem)) {
                    return prevUsers.filter(u => u.id !== userItem.id);
                } else {
                    return [...prevUsers, userItem];
                }
            });
        };

        return (
            <>

                {/* doesnt have the smooth transition as the router.naviagion */}
                {/* <Link href={`/onlyfans/${userItem.id}`}> */}
                <Card isPressable isBlurred key={userItem.id} clickable onPress={(e) => { console.log(e); handleButtonClick(userItem.id) }} css={{ mw: "100%", p: 0 }} >
                    <CardBody css={{ p: 0 }}>
                        <div class="flex">
                            <Avatar src={userItem.avatar} className="w-20 h-20 text-large" />
                            <div css={{ p: "$10" }}>
                                <div class="flex">
                                    <Button
                                        className={isFavorited ? "bg-transparent text-foreground border-default-200" : ""}
                                        color="primary"
                                        radius="full"
                                        size="sm"
                                        variant={isFavorited(userItem) ? "bordered" : "solid"}
                                        onPress={handleFavPress}
                                    >
                                        {isFavorited(userItem) ? "⭐" : "☆"}
                                    </Button>
                                    <b>{userItem.name}</b>
                                </div>
                                <div>
                                    <b>{userItem.favorited}</b> fav
                                </div>
                                <div>{userItem.updatedTime}</div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                {/* </Link> */}
                <Divider className="my-4" />
            </>
        )
    }
    return (
        <>
            <h4>Free OF Lookup</h4>
            <div class="flex">
                <Input
                    placeholder="Search"
                    value={inputText}
                    label="Username"
                    className="max-w-xs"
                    onChange={(e) => { setInputText(e.target.value); }}
                />
                <Button
                    color="primary"
                    icon="search"
                    loading={isLoading}
                    onClick={handleOFSubmit}
                >Button</Button>
            </div>
            {responseData.length > 0 ? (
                <div css={{ df: "column" }}>
                    <Divider className="my-4" />
                    {responseData.map(item => (
                        <UserCard userItem={item} />
                    ))}
                </div>
            ) : (
                <div>{errorMessage}</div>
            )}
        </>
    );
};

export default OFLookupComponent;