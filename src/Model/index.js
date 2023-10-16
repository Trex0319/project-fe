import { Link } from "react-router-dom";
import { Group, Space, Button, Image, Table, Container } from "@mantine/core";
import { useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchModels, deleteModel } from "../api/model";
import { notifications } from "@mantine/notifications";
import { useCookies } from "react-cookie";
import Header from "../Header";
import "../App.css";

export default function Model() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const { data: models } = useQuery({
    queryKey: ["models"],
    queryFn: () => fetchModels(currentUser ? currentUser.token : ""),
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  const deleteMutation = useMutation({
    mutationFn: deleteModel,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["models"],
      });
      notifications.show({
        title: "Model Deleted",
        color: "green",
      });
    },
  });
  return (
    <div className="background2">
      <Container>
        <Header title="Models" page="models" />
        <Space h="20px" />{" "}
        <Group position="right">
          {isAdmin && (
            <Button component={Link} to="/model_add" variant="gradient">
              Add New Model
            </Button>
          )}
        </Group>
        <Space h="20px" />
        <Table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Model</th>
              <th>Detail</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {models
              ? models.map((m) => {
                  return (
                    <tr key={m._id}>
                      <td>
                        {m.image && m.image !== "" ? (
                          <>
                            <Image
                              src={"http://10.1.104.4:8000/" + m.image}
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
                      <td>{m.name}</td>
                      <td>{m.detail}</td>
                      <td>
                        {isAdmin && (
                          <Button
                            variant="outline"
                            color="red"
                            onClick={() => {
                              deleteMutation.mutate({
                                id: m._id,
                                token: currentUser ? currentUser.token : "",
                              });
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}
