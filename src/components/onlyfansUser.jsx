import { useState, useEffect } from "react";
import { Input, Button, Card, CardBody, CardHeader, CardFooter, Avatar, Divider } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export const OFLookupComponent = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [responseData, setResponseData] = useState([]);
    const [inputText, setInputText] = useState("");
    let prevValue;
    const [errorMessage, setErrorMessage] = useState("");

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
                        <>
                            {/* <Button
                                        className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
                                        color="primary"
                                        radius="full"
                                        size="sm"
                                        variant={isFollowed ? "bordered" : "solid"}
                                        onPress={() => setIsFollowed(!isFollowed)}
                                    >
                                        {isFollowed ? "Unfollow" : "Follow"}
                                    </Button> */}
                            <Card isPressable isBlurred key={item.id} clickable onPress={() => handleButtonClick(item.id)} css={{ mw: "100%", p: 0 }} >
                                <CardBody css={{ p: 0 }}>
                                    <div class="flex">
                                        <Avatar src={item.avatar} className="w-20 h-20 text-large" />
                                        <div css={{ p: "$10" }}>
                                            <b>{item.name}</b>
                                            <div>
                                                <b>{item.favorited}</b> fav
                                            </div>
                                            <div>{item.updatedTime}</div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                            <Divider className="my-4" />
                        </>
                    ))}
                </div>

            ) : (
                <div>{errorMessage}</div>
            )}
        </>
    );
};

export default OFLookupComponent;