import { useState, useEffect } from "react";
import { Input, Button, Card, CardBody, CardHeader, CardFooter, Avatar, Divider } from "@nextui-org/react";
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

    const getFavUsers = async () => {
        const jsonValue = await localStorage.getItem(fav_user_key);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    };

    const addFavUser = async (user) => {
        const favUsers = await getFavUsers();

        const existing = favUsers.find((u) => u.id === user.id);
        if (!existing) {
            favUsers.push(user);
            await localStorage.setItem(fav_user_key, JSON.stringify(favUsers));
        }
    };

    const deleteFavUser = async (user) => {
        let favUsers = await getFavUsers();
        favUsers = favUsers.filter((u) => u.id !== user.id);
        await localStorage.setItem(fav_user_key, JSON.stringify(favUsers));
    };

    useEffect(() => {
        const fetchFavData = async () => {
            const result = await getFavUsers();
            console.log(result)
            await setFavoritedUsers(result);
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

        const handleFavPress = async () => {
            if (isFavorited(userItem)) {
                await deleteFavUser(userItem);
            } else {
                await addFavUser(userItem);
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

                <Card isPressable isBlurred key={userItem.id} clickable onPress={() => handleButtonClick(userItem.id)} css={{ mw: "100%", p: 0 }} >
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