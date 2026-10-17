import { createBrowserRouter } from "react-router";
import { PATHS } from "./paths";
import HomePage from "../pages/HomePage";
import TransferPage from "../pages/TransferPage";

// 아직 페이지가 홈뿐이라 모든 경로가 HomePage 를 보여줍니다. 페이지가 생기면 element 만 바꿔주세요.
const router = createBrowserRouter([
  { path: PATHS.HOME, element: <HomePage /> },
  { path: PATHS.HISTORY, element: <HomePage /> },
  { path: PATHS.CUSTOMER, element: <HomePage /> },
  { path: PATHS.MY, element: <HomePage /> },
  { path: PATHS.TRANSFER, element: <TransferPage /> },
]);

export default router;
