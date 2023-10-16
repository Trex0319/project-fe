import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Title,
  Grid,
  Card,
  Badge,
  Group,
  Input,
  Space,
  Image,
  Button,
  LoadingOverlay,
  ActionIcon,
  Select,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCars, deleteCar } from "../api/cars";
import { useCookies } from "react-cookie";
import { addToCart } from "../api/cart";
import { AiOutlineSearch } from "react-icons/ai";
import { TfiTag } from "react-icons/tfi";
import { fetchModels } from "../api/model";
import "../App.css";

function Products() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentCars, setCurrentCars] = useState([]);
  const [model, setModel] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("");
  const { isLoading, data: cars } = useQuery({
    queryKey: ["cars", model],
    queryFn: () => fetchCars(model),
  });

  const { data: models } = useQuery({
    queryKey: ["models"],
    queryFn: () => fetchModels(),
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  useEffect(() => {
    let newList = cars ? [...cars] : [];

    if (searchTerm) {
      newList = newList.filter(
        (i) => i.name.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0
      );
    }

    switch (sort) {
      case "name":
        newList = newList.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        break;
      case "price":
        newList = newList.sort((a, b) => {
          return a.price - b.price;
        });
        break;
      default:
        break;
    }

    setCurrentCars(newList);
  }, [cars, sort, searchTerm]);

  const memoryModels = queryClient.getQueryData([models]);
  const modelOptions = useMemo(() => {
    let options = [];
    if (models && models.length > 0) {
      models.forEach((model) => {
        if (!options.includes(model)) {
          options.push({ value: model._id, label: model.name });
        }
      });
    }
    return options;
  }, [memoryModels]);

  const deleteMutation = useMutation({
    mutationFn: deleteCar,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cars"],
      });
      notifications.show({
        title: "Car Deleted",
        color: "green",
      });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      notifications.show({
        title: "Saved",
        color: "green",
      });
    },
  });

  return (
    <>
      <Group position="apart">
        <Title order={3} color="white">
          <div className="text">Cars Catalogue</div>
          <div className="text">Explore out cars you might like</div>
        </Title>
        {isAdmin && (
          <Button component={Link} to="/cars_add" color="green">
            Add New
          </Button>
        )}
      </Group>
      <Space h="20px" />
      <Group>
        <Select
          placeholder="Pick value"
          data={modelOptions}
          value={model}
          onChange={setModel}
        />

        <Select
          placeholder="Pick value"
          data={[
            { value: "No Sorting", label: "No Sorting" },
            { value: "name", label: "name" },
            { value: "price", label: "price" },
          ]}
          onChange={setSort}
        />

        <div
          style={{ width: "30%" }}
          sx={{
            position: "absolute",
            left: "0px",
            right: "0px",
            margin: " auto",
            display: "flex",
            alignItems: " center",
            justifyContent: "space-between",
            padding: "5px",
            border: "1px solid #ccc",
            borderRadius: "3px",
          }}
        >
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            radius="lg"
            rightSection={<AiOutlineSearch />}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
      </Group>
      <Space h="20px" />
      <LoadingOverlay visible={isLoading} />
      <Grid>
        {currentCars
          ? currentCars.map((car) => {
              return (
                <Grid.Col key={car._id} lg={4} md={6} sm={6} xs={6}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Card.Section>
                      <Image
                        src={"http://localhost:8000/" + car.image}
                        alt={car.title}
                        className="card-img-top"
                      />
                    </Card.Section>

                    <Space h="20px" />
                    <Title order={5}>{car.name}</Title>
                    <Space h="20px" />
                    <Group position="apart" spacing="5px">
                      <Badge color="green">${car.price}</Badge>
                      <Badge color="yellow">{car.model.name}</Badge>
                    </Group>
                    <Space h="20px" />
                    <Group>
                      <Button
                        variant="light"
                        color="blue"
                        radius="md"
                        style={{ flex: 1 }}
                        onClick={() => {
                          if (cookies && cookies.currentUser) {
                            navigate("/detail/" + car._id);
                          } else {
                            notifications.show({
                              title: "Please login to proceed",
                              message: (
                                <>
                                  <Button
                                    color="red"
                                    onClick={() => {
                                      navigate("/login");
                                      notifications.clean();
                                    }}
                                  >
                                    Click here to login
                                  </Button>
                                </>
                              ),
                              color: "red",
                            });
                          }
                        }}
                      >
                        {" "}
                        Show details
                      </Button>
                      <ActionIcon
                        variant="default"
                        radius="md"
                        size={36}
                        onClick={() => {
                          if (cookies && cookies.currentUser) {
                            addToCartMutation.mutate(car);
                          } else {
                            notifications.show({
                              title: "Please login to proceed",
                              message: (
                                <>
                                  <Button
                                    color="red"
                                    onClick={() => {
                                      navigate("/login");
                                      notifications.clean();
                                    }}
                                  >
                                    Click here to login
                                  </Button>
                                </>
                              ),
                              color: "red",
                            });
                          }
                        }}
                      >
                        <ActionIcon
                          variant="gradient"
                          size={38}
                          aria-label="Gradient action icon"
                          radius="md"
                          gradient={{ from: "red", to: "pink", deg: 90 }}
                        >
                          <TfiTag />
                        </ActionIcon>{" "}
                      </ActionIcon>
                    </Group>

                    {isAdmin && (
                      <>
                        <Space h="20px" />
                        <Group position="apart">
                          <Button
                            component={Link}
                            to={"/cars/" + car._id}
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
                                id: car._id,
                                token: currentUser ? currentUser.token : "",
                              });
                            }}
                          >
                            Delete
                          </Button>
                        </Group>
                      </>
                    )}
                  </Card>
                </Grid.Col>
              );
            })
          : null}
      </Grid>
    </>
  );
}

export default Products;
