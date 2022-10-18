import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export type UpdateData = { id: number; value: string };

interface UpdateProps {
  type: string;
  data: UpdateData[];
  updateValue: (item: UpdateData) => void;
  deleteValue: (id: number) => void;
  addValue: (val: string) => void;
}

type LookupTable = { [x: string]: UpdateData };

export default function Update({
  type,
  data,
  updateValue,
  deleteValue,
  addValue,
}: UpdateProps) {
  const baseErrors = { text: false, select: false };

  const [value, setValue] = React.useState(0);
  const [currentItem, setCurrentItem] = React.useState<UpdateData>();
  const [itemTable, setItemTable] = React.useState<LookupTable>({});
  const [errors, setErrors] = React.useState(baseErrors);
  const [textInput, setTextInput] = React.useState("");

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const currentItem = data[0] ? data[0] : undefined;
    setCurrentItem(currentItem);
    setValue(newValue);
    setTextInput("");
    setErrors(baseErrors);
  };

  const handleSelect = (e: SelectChangeEvent) => {
    const itemKey = e.target.value as string;
    const item = getItemFromTable(itemKey);
    setCurrentItem(item);
  };

  const handleTextInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTextInput(
      (e.target as HTMLInputElement | HTMLTextAreaElement).value as string
    );
  };

  const handleAddItem = () => {
    if (textInput.length < 2) {
      setErrors({ ...errors, text: true });
    } else {
      addValue(textInput);
    }
  };
  const handleDeleteItem = () => {
    currentItem && deleteValue(currentItem.id);
  };
  const handleUpdateItem = () => {
    if (textInput.length < 2) {
      setErrors({ ...errors, text: true });
      return;
    } else if (currentItem && textInput) {
      const itemCopy = { ...currentItem };
      itemCopy && updateValue({ ...itemCopy, value: textInput });
    }
  };

  const getItemFromTable = (key: string) => itemTable[key];
  const constructItemKey = (item: UpdateData) => `${item.value}_${item.id}`;

  React.useEffect(() => {
    const constructLookupTable = () => {
      let lookupTable: LookupTable = {};
      data.forEach((value) => {
        const key = constructItemKey(value);
        lookupTable[key] = value;
      });

      setItemTable(lookupTable);
    };
    constructLookupTable();
  }, [data]);

  return (
    <Box sx={{ width: "100%" }}>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
      >
          <Tab label={`New ${type}`} {...a11yProps(0)} />
          <Tab label={`Update ${type}`} {...a11yProps(1)} />
          <Tab label={`Delete ${type}`} {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Box sx={{ mx: 2, mb: 3, maxWidth: 500 }}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={`New ${type}`}
            fullWidth
            variant="standard"
            defaultValue={""}
            error={errors.text}
            onChange={handleTextInput}
          />
        </Box>
        <Button
          variant="contained"
          sx={{ mx: 2 }}
          onClick={handleAddItem}
        >{`Add New ${type}`}</Button>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box sx={{ width: 250, mx: 2, my: 3 }}>
          <InputLabel id="update-select-label">Label To Update</InputLabel>
          <Select
            labelId="update-select-label"
            id="update-select"
            value={currentItem ? constructItemKey(currentItem) : ""}
            style={{ width: "100%", textTransform: "capitalize" }}
            error={errors.select}
            onChange={handleSelect}
          >
            {data.map((val) => (
              <MenuItem
                key={val.id}
                value={constructItemKey(val)}
                style={{ textTransform: "capitalize" }}
              >
                {val.value}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box sx={{ mx: 2, mb: 3, maxWidth: 500 }}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={`New ${type}`}
            fullWidth
            variant="standard"
            error={errors.text}
            onChange={handleTextInput}
          />
        </Box>
        <Button
          variant="contained"
          onClick={handleUpdateItem}
          sx={{ mx: 2 }}
        >{`Update ${type}`}</Button>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Box sx={{ width: 250, mx: 2, my: 3 }}>
          <InputLabel id="de-select-label">{`${type} To Delete`}</InputLabel>
          <Select
            labelId="de-select-label"
            id="de-select"
            value={currentItem ? constructItemKey(currentItem) : ""}
            style={{ width: "100%", textTransform: "capitalize" }}
            error={errors.select}
            onChange={handleSelect}
          >
            {data.map((val) => (
              <MenuItem
                key={val.id}
                value={constructItemKey(val)}
                style={{ textTransform: "capitalize" }}
              >
                {val.value}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Button
          variant="contained"
          color="warning"
          sx={{ mx: 2 }}
          onClick={handleDeleteItem}
        >{`Delete ${type}`}</Button>
      </TabPanel>
    </Box>
  );
}
