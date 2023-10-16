import {
  Group,
  Space,
  Title,
  Divider,
  Button,
  Text,
  Avatar,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Headers({ title, page = "" }) {
  const [cookies, setCookies, removeCookies] = useCookies(["currentUser"]);

  return (
    <div className="header">
      <Space h="50px" />
      <Title align="center" color="white">
        {title}
      </Title>
      <Space h="20px" />
      <Group position="apart">
        <Group>
          <Button
            component={Link}
            to="/"
            variant={page === "home" ? "filled" : "light"}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/savecart"
            variant={page === "cart" ? "filled" : "light"}
          >
            Saved
          </Button>
          <Button
            component={Link}
            to="/model"
            variant={page === "models" ? "filled" : "light"}
          >
            Model
          </Button>
        </Group>
        <Group position="right">
          {cookies && cookies.currentUser ? (
            <>
              <Group>
                <Avatar
                  src="https://www.google.com/url?sa=i&url=https%3A%2F%2Ficon-library.com%2Ficon%2Fno-user-image-icon-23.html&psig=AOvVaw13s6c3zuvGmu-k3Wzwo2bX&ust=1697525735165000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJiM2KX--YEDFQAAAAAdAAAAABAE"
                  radius="xl"
                />
                <div style={{ flex: 1 }}>
                  <Text size="sm" fw={500} color="white">
                    {cookies.currentUser.name}
                  </Text>

                  <Text c="dimmed" size="xs">
                    {cookies.currentUser.email}
                  </Text>
                </div>
              </Group>
              <Button
                variant={"light"}
                onClick={() => {
                  removeCookies("currentUser");
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                variant={page === "login" ? "filled" : "light"}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant={page === "signup" ? "filled" : "light"}
              >
                Sign Up
              </Button>
            </>
          )}
        </Group>
      </Group>
      <Space h="20px" />
      <Divider />
    </div>
  );
}
