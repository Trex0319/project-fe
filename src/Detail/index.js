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
  Text,
  BackgroundImage,
} from "@mantine/core";
import { Link, useParams, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useState, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getCar, deleteCar } from "../api/cars";
import { useCookies } from "react-cookie";
import { BsFillTrashFill } from "react-icons/bs";
import { addComment, fetchComments, deleteComment } from "../api/comment";
import "../App.css";

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
        title: "Comment Add",
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

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
      notifications.show({
        title: "Deleted Successfully",
        color: "grenn",
      });
    },
  });

  return (
    <>
      <BackgroundImage src="/image/360_F_285273061_oQPBtWDMeljw4o5fKIduvW48S5qoGedv.jpg">
        <Container>
          <Space h="50px" />
          <Title order={2} align="center">
            Detail
          </Title>
          <Space h="50px" />

          <Card withBorder shadow="lg">
            <br />
            <div className="text1" align="center">
              {name}
            </div>
            <br />
            <Space h="10px" />
            <div className="text2" align="center">
              {detail}
            </div>
            <Space h="50px" />
            <Image
              src={"http://10.1.104.4:8000/" + image}
              width="500px"
              mx={"auto"}
            />
            <br />
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

              <Grid>
                {comments && comments.length > 0 ? (
                  comments.map((c) => (
                    <Grid.Col span={12}>
                      <Space h={15} />
                      <Divider w="100%" />
                      <Space h={15} />
                      <Group position="apart">
                        <Group>
                          <div
                            style={{ paddingTop: "8px", paddingLeft: "0px" }}
                          >
                            <Text size={14}>
                              <strong style={{ paddingRight: "10px" }}>
                                {c.user.name}
                              </strong>
                              {c.user.createdAt}
                            </Text>
                            <Text size={18}>{c.comments}</Text>
                          </div>
                        </Group>
                        <Group>
                          <Link
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                            }}
                            onClick={() => {
                              deleteCommentMutation.mutate({
                                id: c._id,
                                token: currentUser ? currentUser.token : "",
                              });
                            }}
                          >
                            <BsFillTrashFill />
                          </Link>
                        </Group>
                      </Group>
                    </Grid.Col>
                  ))
                ) : (
                  <>
                    <Space h={15} />
                    <Divider w="100%" />
                    <Space h={50} />
                    <Group position="center">
                      <Text size={16}>No comments yet</Text>
                    </Group>
                  </>
                )}
              </Grid>

              <Space h="30px" />

              {isAdmin && (
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
              )}

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
          </Card>
        </Container>
        <Space h="100px" />
      </BackgroundImage>
    </>
  );
}

export default CarDetails;
