import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { PostureCapture } from './components/posture-capture/PostureCapture.tsx';
import StaticImageCrop from './components/static-image-crop/StaticImageCrop.tsx';
import PostureVerify from './components/posture-verify/PostureVerify.tsx';
import PostureAnalysis from './components/posture-analysis/PostureAnalysis.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "capture",
        element: <PostureCapture />,
      },
      {
        path: "edit",
        element: <StaticImageCrop />,
      },
      {
        path: "verify",
        element: <PostureVerify />,
      },
      {
        path: "analyse",
        element: <PostureAnalysis />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
