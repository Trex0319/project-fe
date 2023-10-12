import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  Divider,
  Button,
  Group,
  Image,
  Grid,
  Textarea,
  ScrollArea,
  Text,
} from "@mantine/core";
import { Link, useParams, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useState, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getCar, deleteCar } from "../api/cars";
import { useCookies } from "react-cookie";
import { addComment, addVideoComment, fetchComments } from "../api/comment";
// import { addToCart } from "../api/cart";

function CarDetails() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [car, setCar] = useState({});
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [detail, setDetail] = useState("");
  const [comment, setComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const { isLoading } = useQuery({
    queryKey: ["car", id],
    queryFn: () => getCar(id),
    onSuccess: (data) => {
      setCar(data);
      setName(data.name);
      setImage(data.image);
      setDetail(data.detail);
    },
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  const deleteMutation = useMutation({
    mutationFn: deleteCar,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cars"],
      });
      notifications.show({
        title: "Character Deleted",
        color: "green",
      });
    },
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["comments"],
    queryFn: () => fetchComments(id),
  });

  const createCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
      notifications.show({
        title: "Unliked",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleAddNewComment = async (event) => {
    event.preventDefault();
    createCommentMutation.mutate({
      data: JSON.stringify({
        comments: comment,
        car: id,
      }),
      token: currentUser ? currentUser.token : "",
    });
    setComment("");
  };

  return (
    <>
      <Container>
        <Space h="50px" />
        <Title order={2} align="center">
          Detail
        </Title>
        <Space h="50px" />

        <Card withBorder shadow="lg">
          <br />
          Name: {name}
          <br />
          Detail: {detail}
          <Space h="50px" />
          <Image
            src={"http://localhost:8000/" + image}
            width="500px"
            mx={"auto"}
          />
          <br />
          {isAdmin && (
            <>
              <Space h="20px" />
              <Group>
                {cookies && cookies.currentUser ? (
                  <>
                    <Group style={{ paddingLeft: "12px" }}>
                      <div>
                        <TextInput
                          placeholder="Add a comment..."
                          variant="unstyled"
                          w={680}
                          radius="md"
                          value={comment}
                          onChange={(event) => setComment(event.target.value)}
                        />
                      </div>
                      {comment.length > 0 && (
                        <div>
                          <Group position="right">
                            <Button
                              style={{ margin: "0px" }}
                              onClick={handleAddNewComment}
                            >
                              Comment
                            </Button>
                          </Group>
                        </div>
                      )}
                    </Group>
                  </>
                ) : (
                  <>
                    <Group>
                      <TextInput
                        value=""
                        placeholder="Enter the description here"
                        style={{ border: "0px 0px 1px 0 px " }}
                      />
                    </Group>
                  </>
                )}
              </Group>

              <ScrollArea.Autosize h={100}>
                {comments && comments.length > 0 ? (
                  comments.map((c) => (
                    <Grid.Col span={12}>
                      <Space h={15} />
                      <Divider w="100%" />
                      <Space h={15} />
                      <Group>
                        <div style={{ paddingTop: "8px", paddingLeft: "0px" }}>
                          <Text size={14}>
                            <strong style={{ paddingRight: "10px" }}>
                              {c.user.name}
                            </strong>
                            {c.user.createdAt}
                          </Text>
                          <Text size={18}>{c.comments}</Text>
                        </div>
                      </Group>
                    </Grid.Col>
                  ))
                ) : (
                  <>
                    <Space h={15} />
                    <Divider w="100%" />
                    <Space h={100} />
                    <Group position="center">
                      <Text size={16}>No comments yet</Text>
                    </Group>
                  </>
                )}
              </ScrollArea.Autosize>

              <Space h="30px" />

              <Group position="apart">
                <Button
                  component={Link}
                  to={"/cars/" + id}
                  color="blue"
                  size="xs"
                  radius="50px"
                >
                  Edit
                </Button>

                <Button
                  color="red"
                  size="xs"
                  radius="50px"
                  onClick={() => {
                    deleteMutation.mutate({
                      id: id,
                      token: currentUser ? currentUser.token : "",
                    });
                  }}
                >
                  Delete
                </Button>
              </Group>
              <Space h="30px" />

              <Group position="center">
                <Button
                  component={Link}
                  to="/"
                  variant="gradient"
                  size="xs"
                  gradient={{ from: "blue", to: "purple", deg: 105 }}
                >
                  Go back to Home
                </Button>
              </Group>
            </>
          )}
        </Card>
      </Container>
    </>
  );
}

export default CarDetails;
