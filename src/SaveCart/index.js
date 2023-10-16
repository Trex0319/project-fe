import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  getCartItems,
  removeItemFromCart,
  removeItemsFromCart,
} from "../api/cart";
import Header from "../Header";
import { useState, useMemo } from "react";
import { notifications } from "@mantine/notifications";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Table,
  Space,
  Grid,
  Group,
  Button,
  Image,
  Checkbox,
  Container,
} from "@mantine/core";
import { useCookies } from "react-cookie";
import "../App.css";

export default function Cart() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const { id } = useParams;
  const [checkedList, setCheckedList] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const queryClient = useQueryClient();
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  const deleteMutation = useMutation({
    mutationFn: removeItemFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      notifications.show({
        title: "Save is Deleted",
        color: "green",
      });
      setCheckAll(false);
    },
  });

  const checkBoxAll = (event) => {
    if (event.target.checked) {
      const newCheckedList = [];
      cart.forEach((cart) => {
        newCheckedList.push(cart._id);
      });
      setCheckedList(newCheckedList);
      setCheckAll(true);
    } else {
      setCheckedList([]);
      setCheckAll(false);
    }
  };

  const checkboxOne = (event, id) => {
    if (event.target.checked) {
      const newCheckedList = [...checkedList];
      newCheckedList.push(id);
      setCheckedList(newCheckedList);
    } else {
      const newCheckedList = checkedList.filter((cart) => cart !== id);
      setCheckedList(newCheckedList);
    }
  };

  const deleteCheckedItems = () => {
    deleteProductsMutation.mutate(checkedList);
  };

  const deleteProductsMutation = useMutation({
    mutationFn: removeItemsFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      notifications.show({
        title: "Unsaved",
        color: "green",
      });
      setCheckAll(false);
      setCheckedList([]);
    },
  });
  return (
    <>
      <div className="background1">
        <Container>
          <Header title="Favorite" page="cart" />
          <Space h="20px" />
          {cookies && cookies.currentUser ? (
            <Group position="center">
              <Table highlightOnHover>
                <thead>
                  <tr>
                    <th>
                      <Checkbox
                        type="checkbox"
                        checked={checkAll}
                        disabled={cart && cart.length > 0 ? false : true}
                        onChange={(event) => {
                          checkBoxAll(event);
                        }}
                      />
                    </th>
                    <th>Image</th>
                    <th>Car</th>
                    <th>
                      <Group position="right">Actions</Group>
                    </th>
                  </tr>
                </thead>{" "}
                <tbody>
                  {cart ? (
                    cart.map((c) => {
                      return (
                        <tr key={c._id}>
                          <td>
                            <Checkbox
                              checked={
                                checkedList && checkedList.includes(c._id)
                                  ? true
                                  : false
                              }
                              type="checkbox"
                              onChange={(event) => {
                                checkboxOne(event, c._id);
                              }}
                            />
                          </td>
                          <td>
                            {c.image && c.image !== "" ? (
                              <>
                                <Image
                                  src={"http://10.1.104.4:8000/" + c.image}
                                  width="100px"
                                />
                              </>
                            ) : (
                              <Image
                                src={
                                  "https://www.aachifoods.com/templates/default-new/images/no-prd.jpg"
                                }
                                width="100px"
                              />
                            )}
                          </td>
                          <td> {c.name}</td>
                          <td>
                            <Group position="right">
                              <Button
                                color="blue"
                                size="xs"
                                radius="md"
                                onClick={() => {
                                  navigate("/detail/" + c._id);
                                }}
                              >
                                {" "}
                                Show details
                              </Button>
                              <Button
                                color="red"
                                size="xs"
                                radius="50px"
                                onClick={() => {
                                  deleteMutation.mutate(c._id);
                                }}
                              >
                                Remove
                              </Button>
                            </Group>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <Grid.Col className="mt-5">
                      <Space h="120px" />
                      <h1 className="text-center text-muted">Empty Cart .</h1>
                    </Grid.Col>
                  )}
                  <tr></tr>
                </tbody>
              </Table>
            </Group>
          ) : (
            <></>
          )}
          <Space h="50px" />
          <Group position="center">
            <Button
              color="red"
              disabled={checkedList && checkedList.length > 0 ? false : true}
              onClick={(event) => {
                event.preventDefault();
                deleteCheckedItems();
              }}
            >
              Delete Selected
            </Button>
          </Group>
        </Container>
      </div>
    </>
  );
}
