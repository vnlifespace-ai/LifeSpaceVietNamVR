import { RouterProvider, createBrowserRouter } from "react-router";
import router from "../routers/router";

function App() {
    const browserRouter = createBrowserRouter(router);
    return (
        <RouterProvider router={browserRouter} />
    );
}

export default App;