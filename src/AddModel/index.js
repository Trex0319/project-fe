import { useState } from "react";
import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  Button,
  Group,
  Image,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { addModel, uploadModelImage } from "../api/model";
import { useCookies } from "react-cookie";

function ModelAdd() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [detail, setDetail] = useState("");
  const [uploading, setUploading] = useState(false);

  const createMutation = useMutation({
    mutationFn: addModel,
    onSuccess: () => {
      notifications.show({
        title: "Model Added",
        color: "green",
      });
      navigate("/model");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleAddNewModel = async (event) => {
    event.preventDefault();
    createMutation.mutate({
      data: JSON.stringify({
        name: name,
        image: image,
        detail: detail,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const uploadMutation = useMutation({
    mutationFn: uploadModelImage,
    onSuccess: (data) => {
      setImage(data.image_url);
      setUploading(false);
    },
    onError: (error) => {
      setUploading(false);
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleImageUpload = (files) => {
    uploadMutation.mutate(files[0]);
    setUploading(true);
  };

  return (
    <Container>
      <Space h="50px" />
      <Title order={2} align="center">
        Add New Model
      </Title>
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
        <TextInput
          value={name}
          placeholder="Enter the Model name here"
          label="Name"
          description="The name of the Model"
          withAsterisk
          onChange={(event) => setName(event.target.value)}
        />
        <Space h="20px" />
        {image && image !== "" ? (
          <>
            <Image src={"http://localhost:8000/" + image} width="100%" />
            <Button color="dark" mt="15px" onClick={() => setImage("")}>
              Remove Image
            </Button>
          </>
        ) : (
          <Dropzone
            mutiple={false}
            accept={IMAGE_MIME_TYPE}
            onDrop={(files) => {
              handleImageUpload(files);
            }}
          >
            <Title order={4} align="center" py="20px">
              Click To Upload Or Drag Image To Upload
            </Title>
          </Dropzone>
        )}
        <Space h="20px" />
        <TextInput
          value={detail}
          placeholder="Enter the Model detail here"
          label="Detail"
          description="The detail of the Model"
          withAsterisk
          onChange={(event) => setDetail(event.target.value)}
        />
        <Space h="20px" />
        <Button fullWidth onClick={handleAddNewModel}>
          Add New Model
        </Button>
      </Card>
      <Space h="20px" />
      <Group position="center">
        <Button
          component={Link}
          to="/model"
          variant="gradient"
          size="xs"
          gradient={{ from: "blue", to: "purple", deg: 105 }}
        >
          Go back to Home
        </Button>
      </Group>
      <Space h="100px" />
    </Container>
  );
}
export default ModelAdd;
