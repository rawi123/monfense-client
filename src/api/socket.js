import io from "socket.io-client";
const ENDPOINT = process.env.REACT_APP_SOCKET_URL;
export default io(ENDPOINT);