import {
  Container,
  Title,
  Space,
  Divider,
  BackgroundImage,
} from "@mantine/core";
import Headers from "../Header";
import Cars from "../Cars";
import "../App.css";

function Home() {
  return (
    <div className="background">
      <Container>
        <Headers title={"Car Showcase"} page="home" />
        <Space h="30px" />
        <Cars />
        <Space h="30px" />
      </Container>
    </div>
  );
}

export default Home;
