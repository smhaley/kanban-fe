import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import { Priority, User, Label } from "../../api/models";
import FilterSelect from "./filter-select";
import Button from "@mui/material/Button";

interface FilterProps {
  users: User[];
  labels: Label[];
  applyFilters: (filterState: FilterState) => void;
  clearFilters: () => void;
  localFilters: FilterState | undefined;
  isFiltered: boolean;
}

export type FilterState = {
  users: string[];
  labels: string[];
  priorities: string[];
};

type Action =
  | { type: "update_labels"; payload: string[] }
  | { type: "update_users"; payload: string[] }
  | { type: "update_priorities"; payload: string[] }
  | { type: "clear_all" }
  | {
      type: "bulk_upload";
      payload: FilterState;
    };

const nullFilters: FilterState = { users: [], labels: [], priorities: [] };

const filterReducer = (state: FilterState, action: Action): FilterState => {
  switch (action.type) {
    case "update_labels":
      return { ...state, labels: action.payload };
    case "update_users":
      return { ...state, users: action.payload };
    case "update_priorities":
      return { ...state, priorities: action.payload };
    case "clear_all":
      return { ...nullFilters };
    case "bulk_upload":
      return { ...action.payload };
  }
};

const isLocalFiltered = (filterState: FilterState) => {
  const { users, labels, priorities } = filterState;
  return labels.length || priorities.length || users.length;
};

export default function Filter({
  labels,
  users,
  applyFilters,
  clearFilters,
  localFilters,
  isFiltered,
}: FilterProps) {
  const [filterState, filterDispatch] = React.useReducer(
    filterReducer,
    localFilters ? localFilters : nullFilters
  );
  const user = users.map((user) => user.username);
  const label = labels.map((label) => label.label);
  const priority = Object.keys(Priority).map((priority) => priority);

  const updateFilters =
    (actionType: "update_labels" | "update_users" | "update_priorities") =>
    (vals: string[]) =>
      filterDispatch({ type: actionType, payload: vals });

  const handleApplyFilters = () => {
    if (isLocalFiltered(filterState) || isFiltered) {
      applyFilters(filterState);
    }
    localStorage.setItem("filterState", JSON.stringify(filterState));
  };

  const handleClearFilters = () => {
    if (isLocalFiltered(filterState) || isFiltered) {
      filterDispatch({ type: "clear_all" });
      clearFilters();
    }
    localStorage.setItem("filterState", JSON.stringify(filterState));
  };

  return (
    <Box sx={{ width: "100%", mr: -5, mt: 2, mb: 1 }}>
      <Accordion sx={{ width: "100%" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            {isFiltered ? (
              <>
                <b>Filtered:</b> Expand to see current selections
              </>
            ) : (
              "Filter"
            )}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <FilterSelect
              values={user}
              label={"Users"}
              selectedValues={filterState.users}
              handleValueSelect={updateFilters("update_users")}
            />
            <FilterSelect
              values={label}
              label="Labels"
              selectedValues={filterState.labels}
              handleValueSelect={updateFilters("update_labels")}
            />
            <FilterSelect
              values={priority}
              label="Priorities"
              selectedValues={filterState.priorities}
              handleValueSelect={updateFilters("update_priorities")}
            />
          </div>
          <Box sx={{ mt: 1 }}>
            <Button
              size="small"
              variant="contained"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
            <Button
              size="small"
              color="secondary"
              variant="contained"
              onClick={handleClearFilters}
              sx={{ ml: 2 }}
            >
              Clear Filters
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
