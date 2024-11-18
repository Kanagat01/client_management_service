import { Spinner } from "react-bootstrap";
import { Toaster } from "react-hot-toast";
import { withProviders } from "./providers";
import { Routing } from "~/pages";
import "./styles/index.scss";

const App = () => {
  return (
    <div className="app">
      <Toaster
        containerClassName="custom-toaster"
        toastOptions={{
          loading: {
            icon: <Spinner variant="secondary" />,
          },
        }}
      />
      <Routing />
    </div>
  );
};

export default withProviders(App);
