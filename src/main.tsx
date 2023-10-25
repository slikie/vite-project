import React from 'react'
import ReactDOM from 'react-dom/client'
import {NextUIProvider} from "@nextui-org/react";
import App from './App.tsx'
import LastFMPage from './components/lastfm.jsx';
import AntiGPTComponent from './components/AntiGPTComponent.jsx'
import PlaygroundComponent from './components/playground.jsx'
import OFLookupComponent from './components/onlyfansUser.jsx'
import OFUserPostComponent from './components/onlyfansUserPost.jsx'
import OFSearchPostComponent from './components/onlyfansSearchPost.jsx'
import CoomerUserPostsComponent from './components/coomerUserPosts.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css'

const router = createBrowserRouter([
  {
    path: "/1",
    element: <div>Hello world!</div>,
  },
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/lastfm",
    element: <LastFMPage />,
  },
  {
    path: "/antigpt",
    element: <AntiGPTComponent />,
  },
  {
    path: "/playground",
    element: <PlaygroundComponent />,
  },
  {
    path: "/onlyfans",
    element: <OFLookupComponent />,
    // children: [
    // {
    //   path: "/onlyfans/:user",
    //   element: <OFUserPostComponent />,
    //   // loader: async ({ params }) => {
    //   //   return fetch(`/api/teams/${params.teamId}.json`);
    //   // },
    //   },
    // ]
  },
  {
    path: "/onlyfans/:user",
    element: <OFUserPostComponent />,
  },
  {
    path: "/search",
    element: <OFSearchPostComponent />,
  },
  {
    path: "/user/:user",
    element: <CoomerUserPostsComponent />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <RouterProvider router={router} />
    </NextUIProvider>
  </React.StrictMode>,
)
