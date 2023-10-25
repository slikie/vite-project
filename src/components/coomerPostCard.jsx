import CoomerMediaPlayer from "./coomerMediaPlayer";
import { Card, CardBody, CardHeader, CardFooter, Divider, User } from "@nextui-org/react";
import { Link } from "react-router-dom";
import Linkify from 'linkify-react';
import "linkify-plugin-mention";

function PostText({ text }) {


    const option = {
        formatHref: {
            mention: (href) => "/user" + href,
        },

        // render: { mention: renderLink, },
        // attributes: {
        //   onClick: (event) => {
        //     if (!confirm('Are you sure you want to leave this page?')) {
        //        event.preventDefault()
        //     }
        //   }
        // }
    };
    return (
        <Linkify class="pt-2" as={"b"} options={option}>
            {text}
        </Linkify>
    );
}

export function PostCard({ post }) {

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
