import React, { useState } from "react";
import { Input, Button, Card, CardBody, CardHeader, CardFooter, Image, Avatar, Tabs, Tab, } from "@nextui-org/react";

//import 'react-photo-view/dist/react-photo-view.css';
import { PhotoProvider, PhotoView } from 'react-photo-view';

const PlaygroundComponent = () => {
   const [isFollowed, setIsFollowed] = React.useState(false);
   const [filterValue, setFilterValue] = React.useState("");
   const [name, setName] = useState('');
   const [pwd, setPwd] = useState('');

   const handle = () => {
      localStorage.setItem('Name', name);
      localStorage.setItem('Password', pwd);
   };
   const remove = () => {
      localStorage.removeItem('Name');
      localStorage.removeItem('Password');
   };

   const tabs = [
      {
         id: "photos",
         label: "Photos",
         content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      },
      {
         id: "music",
         label: "Music",
         content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
      },
      {
         id: "music2",
         label: "Music",
         content: "22222"
      },
      {
         id: "videos",
         label: "Videos",
         content: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      }
   ];
   const filteredTabs = tabs.filter(tab => 
      tab.content.includes(filterValue)
    );
   // const musicTabs = tabs.filter(tab => tab.label.includes("Music"));
   return (
      <div className="App">
         <Input
            placeholder="filtering"
            value={filterValue}
            onValueChange={setFilterValue}
         />
         <div className="flex w-full flex-col">
            <Tabs aria-label="Options">
               <Tab key="music" title="Music">
                  {filteredTabs.map(tab => (
                     <Card>
                        <CardBody>
                           {tab.content}
                        </CardBody>
                     </Card>
                  ))}
               </Tab>

               <Tab key="photos" title="Photos">
                  <Card>
                     <CardBody>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                     </CardBody>
                  </Card>
               </Tab>
               <Tab key="videos" title="Videos">
                  <Card>
                     <CardBody>
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                     </CardBody>
                  </Card>
               </Tab>
            </Tabs>
         </div>
         <Card className="max-w-[340px]">
            <CardHeader className="justify-between">
               <div className="flex gap-5">
                  <Avatar isBordered radius="full" size="md" src="/avatars/avatar-1.png" />
                  <div className="flex flex-col gap-1 items-start justify-center">
                     <h4 className="text-small font-semibold leading-none text-default-600">Zoey Lang</h4>
                     <h5 className="text-small tracking-tight text-default-400">@zoeylang</h5>
                  </div>
               </div>
               <Button
                  className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
                  color="primary"
                  radius="full"
                  size="sm"
                  variant={isFollowed ? "bordered" : "solid"}
                  onPress={() => setIsFollowed(!isFollowed)}
               >
                  {isFollowed ? "Unfollow" : "Follow"}
               </Button>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">
               <p>
                  Frontend developer and UI/UX enthusiast. Join me on this coding adventure!
               </p>
               <span className="pt-2">
                  #FrontendWithZoey
                  <span className="py-2" aria-label="computer" role="img">
                     💻
                  </span>
               </span>
            </CardBody>
            <CardFooter className="gap-3">
               <div className="flex gap-1">
                  <p className="font-semibold text-default-400 text-small">4</p>
                  <p className=" text-default-400 text-small">Following</p>
               </div>
               <div className="flex gap-1">
                  <p className="font-semibold text-default-400 text-small">97.1K</p>
                  <p className="text-default-400 text-small">Followers</p>
               </div>
            </CardFooter>
         </Card>
         <Card>
            <CardBody>
               <p>Make beautiful websites regardless of your design experience.</p>
            </CardBody>

         </Card>
         <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
               <p className="text-tiny uppercase font-bold">Daily Mix</p>
               <small className="text-default-500">12 Tracks</small>
               <h4 className="font-bold text-large">Frontend Radio</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
               <Image
                  alt="Card background"
                  className="object-cover rounded-xl"
                  src="https://nextui.org/images/hero-card-complete.jpeg"
                  width={270}
               />
            </CardBody>
         </Card>
         <Image
            isZoomed
            width={240}
            alt="NextUI Fruit Image with Zoom"
            src="https://nextui-docs-v2.vercel.app/images/fruit-1.jpeg"
            className="m-5"
         />
         <PhotoProvider>
            <PhotoView >
               <img src={"https://nextui-docs-v2.vercel.app/images/fruit-1.jpeg"} alt="" />
            </PhotoView>
         </PhotoProvider>

         <PhotoProvider>
            <PhotoView >
               <img src={"https://nextui-docs-v2.vercel.app/images/fruit-1.jpeg"} alt="" />
            </PhotoView>
         </PhotoProvider>
         <h1>Name of the user:</h1>
         <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
         />
         <h1>Password of the user:</h1>
         <input
            type="password"
            placeholder="Password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
         />
         <div>
            <button onClick={handle}>Done</button>
         </div>
         {localStorage.getItem('Name') && (
            <div>
               Name: <p>{localStorage.getItem('Name')}</p>
            </div>
         )}
         {localStorage.getItem('Password') && (
            <div>
               Password: <p>{localStorage.getItem('Password')}</p>
            </div>
         )}
         <div>
            <button onClick={remove}>Remove</button>
         </div>
      </div>
   )
};

export default PlaygroundComponent;