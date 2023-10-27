import { useState, useEffect, useContext } from "react";
import { Input, Button, Card, CardBody, Avatar, Divider } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { FavoritesContext, FavoritesProvider } from './FavoritesProvider';

export const UserCard = ({ userItem }) => {

    const { favoritedUsers, handleToggleFavoriteUser } = useContext(FavoritesContext);
    function isFavoritedUser(user) {
        return favoritedUsers.some(p => p.id === user.id);
      }
    return (
        <>
            <Link to={`/user/${userItem.id}` }>
            <Card  isBlurred key={userItem.id} clickable css={{ mw: "100%", p: 0 }} >
                <CardBody css={{ p: 0 }}>
                    <div class="flex">
                        <Avatar src={userItem.avatar} className="w-20 h-20 text-large" />
                        <div css={{ p: "$10" }}>
                            <div class="flex">
                                <Button
                                    className={isFavoritedUser ? "bg-transparent text-foreground border-default-200" : ""}
                                    color="primary"
                                    radius="full"
                                    size="sm"
                                    variant={isFavoritedUser(userItem) ? "bordered" : "solid"}
                                    onPress={handleToggleFavoriteUser}
                                >
                                    {isFavoritedUser(userItem) ? "⭐" : "☆"}
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
            </Link>
            <Divider className="my-4" />
        </>
    )
}


export const CoomerUserLookupComponent = () => {
    // const navigate = useNavigate();
    // const fav_user_key = "favCoomerUsers";
    // const [favoritedUsers, setFavoritedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [responseData, setResponseData] = useState([]);
    const [inputText, setInputText] = useState("");
    let prevValue = "";
    const [errorMessage, setErrorMessage] = useState("");

    const { favoritedUsers } = useContext(FavoritesContext);

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

    return (
        <FavoritesProvider>
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
                >Search</Button>
                <Button
                    color="primary"
                    icon="search"
                    loading={isLoading}
                    onClick={() => { setResponseData(favoritedUsers) }}
                >My Fav List?</Button>
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
        </FavoritesProvider>
    );
};

export default CoomerUserLookupComponent;