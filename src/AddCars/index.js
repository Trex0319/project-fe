import { useState, useMemo } from "react";
import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  Textarea,
  NumberInput,
  Divider,
  Button,
  Group,
  Image,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { addCar, uploadCarImage } from "../api/cars";
import { useCookies } from "react-cookie";
import { fetchModels } from "../api/model";

function CarAdd() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const [detail, setDetail] = useState("");
  const [price, setPrice] = useState("");
  const [model, setModel] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const { data: models } = useQuery({
    queryKey: ["models"],
    queryFn: () => fetchModels(),
  });

  const createMutation = useMutation({
    mutationFn: addCar,
    onSuccess: () => {
      notifications.show({
        title: "New Car Added",
        color: "green",
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

  const handleAddNewCar = async (event) => {
    event.preventDefault();
    createMutation.mutate({
      data: JSON.stringify({
        name: name,
        detail: detail,
        price: price,
        model: model,
        image: image,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const uploadMutation = useMutation({
    mutationFn: uploadCarImage,
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

  const memoryModels = queryClient.getQueryData([models]);
  const modelOptions = useMemo(() => {
    let options = [];
    if (models && models.length > 0) {
      models.forEach((model) => {
        if (!options.includes(model)) {
          options.push(model);
        }
      });
    }
    return options;
  }, [memoryModels]);

  return (
    <Container>
      <Space h="50px" />
      <Title order={2} align="center">
        Add New Car
      </Title>
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
        <TextInput
          value={name}
          placeholder="Enter the car name here"
          label="Name"
          detail="The name of the car"
          withAsterisk
          onChange={(event) => setName(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
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
            loading={uploading}
            multiple={false}
            accept={IMAGE_MIME_TYPE}
            onDrop={(files) => {
              handleImageUpload(files);
            }}
          >
            <Title order={4} align="center" py="20px">
              Click to upload or Drag image to upload
            </Title>
          </Dropzone>
        )}
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <Textarea
          value={detail}
          placeholder="Enter the detail here"
          label="Detail"
          detail="The detail for the product"
          withAsterisk
          onChange={(event) => setDetail(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <NumberInput
          value={price}
          placeholder="Enter the price here"
          label="Price(USD)"
          precision={2}
          description="What is a price"
          withAsterisk
          onChange={setPrice}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <select
          value={model}
          onChange={(event) => {
            setModel(event.target.value);
          }}
        >
          <option value="">All Models</option>
          {modelOptions.map((model) => {
            return (
              <option key={model._id} value={model._id}>
                {model.name}
              </option>
            );
          })}
        </select>

        <Space h="20px" />
        <Button fullWidth onClick={handleAddNewCar}>
          Add New
        </Button>
      </Card>
      <Space h="50px" />
      <Group position="center">
        <Button component={Link} to="/" variant="subtle" size="xs" color="gray">
          Go back to Home
        </Button>
      </Group>
      <Space h="50px" />
    </Container>
  );
}
export default CarAdd;
