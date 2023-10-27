import { useState, useEffect, useContext } from "react";
import { Input, Button, Card, CardBody, Avatar, Divider } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { FavoritesContext, FavoritesProvider } from './FavoritesProvider';

export const UserCard = ({ userItem: user }) => {

    const { favoritedUsers, handleToggleFavoriteUser } = useContext(FavoritesContext);
    function isFavoritedUser(u) {
        return favoritedUsers.some(p => p.id === u.id);
    }
    return (
        <>
            <Card css={{ mw: '100%', p: 0 }}>
                <CardBody css={{ p: 0 }}>

                    <Link href={`/users/${user.id}`}>
                        <div className="flex">
                            <Avatar src={user.avatar} className="w-20 h-20" />

                            <div className="flex flex-col justify-between p-5">
                                <div>
                                    <b className="text-lg">{user.name}</b>
                                </div>

                                <small className="text-gray-500">
                                    {user.favorited} favorites
                                </small>

                                <small className="text-gray-500">
                                    {user.updatedTime}
                                </small>
                            </div>
                        </div>
                    </Link>
                    <Button
//transition
                        className={`transition duration-200 ${isFavoritedUser(user) ? 'bg-yellow-400' : 'bg-gray-300'} rounded-full px-2`}

                        flat
                        rounded
                        auto
                        icon={isFavoritedUser ? 'star' : 'star-outline'}
                        color="primary"
                        onPress={() => handleToggleFavoriteUser(user)}
                    >
                        {isFavoritedUser(user) ? 'Unfavorite' : 'Favorite'}
                    </Button>
                </CardBody>
            </Card>
            <Divider className="my-4" />
        </>
    )
}


export const CoomerUserLookupComponent = () => {
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