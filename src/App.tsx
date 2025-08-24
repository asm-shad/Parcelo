import CommonLayout from "./components/layout/CommonLayout";
import { Outlet } from "react-router";

function App() {
  return (
    <CommonLayout>
      <Outlet />
    </CommonLayout>
  );
}

export default App;
