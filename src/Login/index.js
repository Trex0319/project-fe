import {
  PasswordInput,
  TextInput,
  Group,
  Container,
  Title,
  Space,
  Button,
  Card,
} from "@mantine/core";
import Header from "../Header";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";
import { Link } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";
import "../App.css";

export default function Login() {
  const [cookies, setCookie] = useCookies(["currentUser"]);
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      setCookie("currentUser", user, {
        maxAge: 60 * 60 * 24 * 14,
      });
      navigate("/");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleSubmit = () => {
    if (!email || !password) {
      notifications.show({
        title: "Please fill in both email and password.",
        color: "red",
      });
    } else {
      loginMutation.mutate(
        JSON.stringify({
          email: email,
          password: password,
        })
      );
    }
  };

  return (
    <div className="background3">
      <Container>
        <Header title="Login" page="login" />
        <Space h="60px" />
        <Card
          withBorder
          shadow="lg"
          mx="auto"
          sx={{
            maxWidth: "500px",
          }}
        >
          <TextInput
            value={email}
            placeholder="Email"
            label="Email"
            required
            onChange={(event) => setEmail(event.target.value)}
          />
          <Space h="20px" />
          <PasswordInput
            value={password}
            placeholder="Password"
            label="Password"
            required
            onChange={(event) => setPassword(event.target.value)}
          />
          <Space h="20px" />
          <Group position="center">
            <Button onClick={handleSubmit}>Login</Button>
          </Group>
        </Card>
        <Space h="20px" />
        <Group position="center">
          <Button
            component={Link}
            to="/"
            variant="subtle"
            size="xs"
            color="gray"
          >
            Go back to Home
          </Button>
        </Group>
      </Container>
    </div>
  );
}
