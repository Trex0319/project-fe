import {
  Container,
  Title,
  Space,
  Divider,
  BackgroundImage,
} from "@mantine/core";
import Headers from "../Header";
import Cars from "../Cars";

function Home() {
  return (
    <Container>
      <Headers title={"Car Showcase"} page="home" />
      <Space h="30px" />
      <Cars />
      <Space h="30px" />
    </Container>
  );
}

export default Home;
