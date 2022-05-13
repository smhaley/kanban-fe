import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { GetServerSideProps } from "next";
import * as ItemService from "../../api/item_service";
import * as UserService from "../../api/user_service";
import * as LabelService from "../../api/label_service";
import { Item, Label, User } from "../../api/models";
import ItemDisplay from "../../components/shared/item-display";
export const getServerSideProps: GetServerSideProps = async (context) => {
  let item: Item | undefined = undefined;

  try {
    if (context.params && context.params.id) {
      item = await ItemService.getItem(context.params.id as string);
    }
  } catch (e) {
    return {
      notFound: true,
    };
  }

  const users = await UserService.getUsers();
  const labels = await LabelService.getLabels();
  if (!users || !labels || !item) {
    return {
      notFound: true,
    };
  }
  return {
    props: { item, users, labels },
  };
};

interface ItemPageProps {
  item: Item;
  labels: Label[];
  users: User[];
}

const ItemPage: NextPage<ItemPageProps> = ({ item, users, labels }) => {
  const [itemState, setItemState] = React.useState(item);

  const handleUpdateItem = async (updateItem: Item) => {
    const newItem = await ItemService.updateItem(updateItem);
    setItemState(newItem);
  };

  const handleDeleteItem = async (itemId: string) => {
    await ItemService.deleteItem(itemId);
    //redirect to home
  };
  return (
    <Container maxWidth="md" style={{ width: "100%" }}>
      <Box sx={{ mt: 5 }}>
        <Paper sx={{ minHeigh: 500 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <ItemDisplay
              item={itemState}
              updateItem={handleUpdateItem}
              isNew={false}
              deleteItem={handleDeleteItem}
              labels={labels}
              users={users}
              showTitle
            />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ItemPage;
