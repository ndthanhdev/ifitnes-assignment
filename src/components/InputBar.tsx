import React from "react";
import { InputBase, Paper, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import SearchIcon from "@material-ui/icons/Search";
import { useDispatch } from "react-redux";
import { updateInput } from "../store/actions";
import _ from "lodash";

const useStyles = makeStyles({
  root: {
    display: "flex"
  },
  input: {
    flex: 1,
    marginLeft: "0.5rem"
  },
  iconButton: {
    padding: "0.5rem"
  }
});

export const QueryBar: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch()
  const debounceDispatch = _.debounce(dispatch,500)

  return (
    <Paper className={classes.root}>
      <InputBase
        placeholder="<ticket symbol> <value>"
        className={classes.input}
        onChange={e=>debounceDispatch(updateInput(e.target.value))}
      />
      <IconButton className={classes.iconButton} aria-label="Search" >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};
