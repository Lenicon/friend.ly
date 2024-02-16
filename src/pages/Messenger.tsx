import "../assets/css/messenger.css";
import Content from "../components/Content";
import Sidebar from "../components/Sidebar";

export default function Messenger() {
  // const [chat, setChat] = useState(false);
  return (
    <div className="messenger">
      <Sidebar/>
      <Content/>
    </div>
  );
}